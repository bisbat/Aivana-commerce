import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
  // 1. Create user first
  const user = this.userRepository.create(createUserDto);
  await this.userRepository.save(user);

  // 2. Create customer profile linked to user
  const customer = this.customerRepository.create({
    user: user
  });
  await this.customerRepository.save(customer);

  return user;
}


  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  // async create(createUserDto: CreateUserDto): Promise<UserEntity> {
  //   const user = this.userRepository.create(createUserDto);
  //   return await this.userRepository.save(user);
  // }

  // async findAll(): Promise<UserEntity[]> {
  //   return await this.userRepository.find({
  //     relations: ['products'],
  //   });
  // }

  // async findOne(id: number): Promise<UserEntity | null> {
  //   return await this.userRepository.findOne({
  //     where: { id },
  //     relations: ['products'],
  //   });
  // }

  // async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
  //   await this.userRepository.update(id, updateUserDto);
  //   return this.findOne(id);
  // }

  // async remove(id: number): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
}
