// user-collection.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCollectionEntity } from './entities/user-collection.entity';

@Injectable()
export class UserCollectionService {
  constructor(
    @InjectRepository(UserCollectionEntity)
    private userCollectionRepository: Repository<UserCollectionEntity>,
  ) {}

  async findByUserId(userId: number) {
    return this.userCollectionRepository.find({
      where: { userId },
      relations: ['product', 'orderItem'],
    });
  }
}
