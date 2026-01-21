import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async create(data: {
    pathImage: string;
    productId: number;
  }): Promise<ProductImage> {
    const productImage = this.productImageRepository.create({
      pathImage: data.pathImage,
      product: { id: data.productId } as ProductEntity,
    });
    return await this.productImageRepository.save(productImage);
  }

  async findOne(id: number): Promise<ProductImage | null> {
    return await this.productImageRepository.findOne({
      where: { imageId: id },
      relations: ['product'],
    });
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return await this.productImageRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.productImageRepository.delete({ imageId: id });
  }
}
