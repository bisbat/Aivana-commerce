import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async findOne(id: number): Promise<ProductImage | null> {
    return await this.productImageRepository.findOne({
      where: { image_id: id },
      relations: ['product'],
    });
  }
}
