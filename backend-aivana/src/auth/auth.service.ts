import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enum/role.enum';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AuthInput, SignInData } from './interfaces';
import { MinioService } from 'src/minio/minio.service';
import { MINIO_FOLDERS } from 'src/constants/minio-folders.constant';
import { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private minioService: MinioService,
  ) {}

  async register(
    registerDto: RegisterDto,
    avatarFile?: UploadedFileType,
  ): Promise<{ accessToken: string }> {
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
      role: Role.CUSTOMER,
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

  async authenticate(input: AuthInput): Promise<{ accessToken: string }> {
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

  async signIn(user: SignInData): Promise<{ accessToken: string }> {
    const JwtPayload = {
      sub: user.userId,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(JwtPayload);

    return { accessToken };
  }

  // ── Google OAuth: find existing user by email, or create new one ──────────
  async googleLogin(profile: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  }): Promise<SignInData> {
    // 1. ถ้ามี email อยู่แล้ว → ใช้ account เดิมเลย
    const existing = await this.userService.findUserByEmail(profile.email);

    if (existing) {
      return {
        userId: existing.id,
        email: existing.email,
        username: existing.username,
        firstName: existing.firstName,
        lastName: existing.lastName,
        role: existing.role,
        avatarUrl: existing.avatarUrl,
        sellerId: existing.sellerProfile?.id ?? null,
      };
    }

    // 2. ถ้าไม่มี → สร้าง user ใหม่ด้วยข้อมูลจาก Google
    // username = email prefix ถ้าซ้ำให้ต่อ random 4 digits
    const emailPrefix = profile.email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_]/g, '');
    let username =
      emailPrefix.length >= 3 ? emailPrefix : `user_${emailPrefix}`;
    const taken = await this.userService.findUserByName(username);
    if (taken) {
      username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // password = random hash (Google users จะไม่ login ด้วย password)
    const randomPassword = await bcrypt.hash(uuidv4(), 10);

    const newUser = await this.userService.create({
      email: profile.email,
      username,
      password: randomPassword,
      firstName: profile.firstName || null,
      lastName: profile.lastName || null,
      role: Role.CUSTOMER,
      avatarUrl: profile.avatarUrl ?? null,
    });

    return {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      avatarUrl: profile.avatarUrl,
      sellerId: null,
    };
  }
}
