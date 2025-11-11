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

  async create(data: {
    path_image: string;
    product_id: number;
  }): Promise<ProductImage> {
    const productImage = this.productImageRepository.create({
      path_image: data.path_image,
      product: { id: data.product_id },
    });
    return await this.productImageRepository.save(productImage);
  }

  async findOne(id: number): Promise<ProductImage | null> {
    return await this.productImageRepository.findOne({
      where: { image_id: id },
      relations: ['product'],
    });
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return await this.productImageRepository.find({
      where: { product: { id: productId } },
    });
  }

  async remove(id: number): Promise<void> {
    await this.productImageRepository.delete({ image_id: id });
  }
}
