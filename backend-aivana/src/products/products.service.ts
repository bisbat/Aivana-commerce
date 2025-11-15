import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { MinioService } from '../minio/minio.service';
import { ProductWithImagesDto } from './interfaces/product-with-images.interface';
import { TagEntity } from 'src/tags/entities/tag.entity';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private minioService: MinioService,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) { }

  async getAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'owner', 'tags'],
    });
    return products;
  }

  async findOne(productId: number): Promise<ProductEntity | null> {
    return await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'owner', 'tags'],
    });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const { tagIds, categoryId, ownerId, ...productData } = createProductDto;

    // หา tags
    const tags = tagIds ? await this.tagRepository.findBy({ id: In(tagIds) }) : [];
    if (tagIds && tags.length !== tagIds.length) {
      throw new Error('One or more tags not found');
    }

    // preload category และ owner
    const category = { id: categoryId }; // ถ้า category มีอยู่แล้วและแค่ต้อง attach
    const owner = { id: ownerId };       // ถ้า owner มีอยู่แล้วและแค่ attach

    const product = this.productsRepository.create({
      ...productData,
      tags,
      category,
      owner,
    });

    return await this.productsRepository.save(product);
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
      relations: ['category', 'owner', 'tags'],
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
