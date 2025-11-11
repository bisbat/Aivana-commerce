import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { MinioService } from '../minio/minio.service';
import { ProductWithImagesDto } from './interfaces/product-with-images.interface';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private minioService: MinioService,
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

  async updateUploadedFilePath(
    productId: number,
    uploadedFilePath: string,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'owner'],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    product.uploaded_file_path = uploadedFilePath;
    await this.productsRepository.save(product);

    return product;
  }

  async getProductById(id: number): Promise<ProductWithImagesDto | null> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'owner', 'product_images'],
    });

    if (!product) {
      return null;
    }

    const detailImages =
      product.product_images?.map((image) => ({
        image_id: image.image_id,
        path_image: image.path_image,
        url: this.minioService.getFileUrl(image.path_image),
      })) || [];

    // Remove product_images and add detail_images with URLs
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { product_images, ...productData } = product;

    return {
      ...productData,
      detail_images: detailImages,
    };
  }
}
