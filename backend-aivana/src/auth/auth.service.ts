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

  private async downloadAndStoreGoogleAvatar(
    avatarUrl: string,
    userId: string,
  ): Promise<string | null> {
    try {
      const response = await fetch(avatarUrl);
      if (!response.ok) {
        console.error(`Failed to download avatar: ${response.statusText}`);
        return null;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      const timestamp = Date.now();
      const avatarFileName = `avatar-${userId}-${timestamp}-google.jpg`;

      const avatarFullPath = await this.minioService.uploadFile(
        {
          buffer,
          mimetype: contentType,
          size: buffer.length,
          originalname: `google-avatar-${userId}.jpg`,
        },
        avatarFileName,
        MINIO_FOLDERS.USERS.AVATARS(userId),
      );

      return this.minioService.getFileUrl(avatarFullPath);
    } catch (error) {
      console.error('Error downloading and storing Google avatar:', error);
      return null;
    }
  }

  async register(
    registerDto: RegisterDto,
    avatarFile?: UploadedFileType,
  ): Promise<{ accessToken: string }> {
    const existingUserByEmail = await this.userService.findUserByEmail(
      registerDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByUsername = await this.userService.findUserByName(
      registerDto.username,
    );
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role: Role.CUSTOMER,
      avatarUrl: null,
    });

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

      await this.userService.update(user.id, { avatarUrl });
    }

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

  async googleLogin(profile: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  }): Promise<SignInData> {

    const existing = await this.userService.findUserByEmail(profile.email);

    if (existing) {
      if (profile.avatarUrl) {
        const storedAvatarUrl = await this.downloadAndStoreGoogleAvatar(
          profile.avatarUrl,
          existing.id,
        );
        if (storedAvatarUrl) {
          await this.userService.update(existing.id, {
            avatarUrl: storedAvatarUrl,
          });
        }
      }

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

    const emailPrefix = profile.email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_]/g, '');
    let username =
      emailPrefix.length >= 3 ? emailPrefix : `user_${emailPrefix}`;
    const taken = await this.userService.findUserByName(username);
    if (taken) {
      username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const randomPassword = await bcrypt.hash(uuidv4(), 10);

    const newUser = await this.userService.create({
      email: profile.email,
      username,
      password: randomPassword,
      firstName: profile.firstName || null,
      lastName: profile.lastName || null,
      role: Role.CUSTOMER,
      avatarUrl: null, 
    });

    let storedAvatarUrl: string | null = null;
    if (profile.avatarUrl) {
      storedAvatarUrl = await this.downloadAndStoreGoogleAvatar(
        profile.avatarUrl,
        newUser.id,
      );

      if (storedAvatarUrl) {
        await this.userService.update(newUser.id, {
          avatarUrl: storedAvatarUrl,
        });
      }
    }

    return {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      avatarUrl: storedAvatarUrl,
      sellerId: null,
    };
  }
}
