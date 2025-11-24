import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
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
    return await this.userRepository.find({relations: ['customerProfile', 'sellerProfile']});
  }

}
