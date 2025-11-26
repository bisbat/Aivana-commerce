import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { UserRoles } from 'src/constants/user-roles.enum';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) { }

  async createUser(registerDto: RegisterDto): Promise<ResponseUserDto> {
    const { email, username, password, firstName, lastName, avatarUrl } = registerDto;

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

    await this.userRepository.save(user);

    await this.customerRepository.save({ user });

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }


  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['customerProfile', 'sellerProfile'] });
  }

  async findUserByName(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['customerProfile', 'sellerProfile'], // optional
    });
  }

}
