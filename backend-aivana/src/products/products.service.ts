import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  async getAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'owner'],
    });
    return products;
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const product = this.productsRepository.create(createProductDto);
    const savedProduct = {
      ...product,
      category: { id: createProductDto.categoryId },
      owner: { id: createProductDto.ownerId },
    };
    return await this.productsRepository.save(savedProduct);
  }
}
