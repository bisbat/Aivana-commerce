import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';
import { UserRoles } from 'src/constants/user-roles.enum';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<ResponseUserDto> {
    const { email, username, password, firstName, lastName, avatarUrl } =
      registerDto;

    const existing = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existing) {
      throw new BadRequestException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      avatarUrl,
      role: UserRoles.CUSTOMER, // default as in your entity
    });

    const savedUser = await this.userRepository.save(user);

    const token = await this.authService.signIn({
      userId: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    });

    const userTransform = plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });

    return { ...userTransform, ...token };
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['sellerProfile'] });
  }

  async findUserByName(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['sellerProfile'], // optional
    });
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['customerProfile', 'sellerProfile'],
    });
  }
}
