import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/constants/user-roles.enum';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthInput, SignInData, AuthResult, JwtPayload } from './interfaces';
import { MinioService } from 'src/minio/minio.service';
import { MINIO_FOLDERS } from 'src/constants/minio-folders.constant';
import { UploadedFileType } from 'src/products/interfaces/uploaded-file.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
    private minioService: MinioService,
  ) {}

  async register(
    registerDto: RegisterDto,
    avatarFile?: UploadedFileType,
  ): Promise<AuthResult> {

    // 1. ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUserByEmail = await this.userService.findUserByEmail(
      registerDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // 2. ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUserByUsername = await this.userService.findUserByName(
      registerDto.username,
    );
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 4. สร้าง user โดยเป็น CUSTOMER ทุกคน (ยังไม่มี avatarUrl)
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRoles.CUSTOMER,
      avatarUrl: null,
    });

    // 5. ถ้ามีไฟล์ avatar ให้ upload ไป MinIO
    let avatarUrl: string | undefined = undefined;
    if (avatarFile) {
      const timestamp = Date.now();
      const avatarFileName = `avatar-${user.id}-${timestamp}-${avatarFile.originalname}`;

      const avatarFullPath = await this.minioService.uploadFile(
        avatarFile,
        avatarFileName,
        MINIO_FOLDERS.USERS.AVATARS(user.id),
      );

      avatarUrl = this.minioService.getFileUrl(avatarFullPath);

      // อัปเดต avatarUrl ใน database
      await this.userService.update(user.id, { avatarUrl });
    }

    // 6. เตรียมข้อมูล sign in
    const userData: SignInData = {
      userId: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: avatarUrl ?? null,
      sellerId: null,
    };
    return this.signIn(userData);
  }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findUserByName(input.username);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) return null;

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      sellerId: user.sellerProfile?.id ?? null,
    };
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
      sellerId: user.sellerId ?? null,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      user,
    };
  }
}
