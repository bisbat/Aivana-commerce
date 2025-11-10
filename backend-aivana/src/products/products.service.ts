import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async findOne(productId: number): Promise<ProductEntity | null> {
    return await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'owner'],
    });
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

  async updateHeroImage(
    productId: number,
    heroImageUrl: string,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'owner'],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    product.hero_image_url = heroImageUrl;
    await this.productsRepository.save(product);

    return product;
  }

  async updatePreviewUrl(
    productId: number,
    previewUrl: string,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'owner'],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    product.preview_url = previewUrl;
    await this.productsRepository.save(product);

    return product;
  }

  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'owner'],
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, updateProductDto);
    await this.productsRepository.save(product);
    const updatedProduct = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'owner'],
    });
    if (!updatedProduct) {
      throw new Error('Product not found after update');
    }
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
