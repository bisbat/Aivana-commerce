import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ) {}

  async createSeller(createSellerDto: CreateSellerDto): Promise<SellerEntity> {
    const seller = this.sellerRepository.create(createSellerDto);
    return await this.sellerRepository.save(seller);
  }

  async getAllSellers(): Promise<SellerEntity[]> {
    return await this.sellerRepository.find();
  }

  async getSellerById(id: string): Promise<SellerEntity | null> {
    return await this.sellerRepository.findOne({
      where: { id },
    });
  }

}
