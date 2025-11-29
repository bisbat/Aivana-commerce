import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async update(
    userId: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserEntity> {
    await this.userRepository.update(userId, updateUserDto);
    const updatedUser = await this.findUserById(userId);
    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }
    return updatedUser;
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
      relations: ['sellerProfile'],
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['sellerProfile'], // optional
    });
  }
}
