import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { MinioService } from '../minio/minio.service';
import { ProductWithImagesDto } from './interfaces/product-with-images.interface';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';
import type { UploadedFileType } from './interfaces/uploaded-file.interface';
import { ProductImageService } from '../product-image/product-image.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private minioService: MinioService,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    private productImageService: ProductImageService,
  ) {}

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

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { tagIds, categoryId, ownerId, ...productData } = createProductDto;

    // หา tags
    const tags = tagIds
      ? await this.tagRepository.findBy({ id: In(tagIds) })
      : [];
    if (tagIds && tags.length !== tagIds.length) {
      throw new Error('One or more tags not found');
    }

    // preload category และ owner
    const category = { id: categoryId }; // ถ้า category มีอยู่แล้วและแค่ต้อง attach
    const owner = { id: ownerId }; // ถ้า owner มีอยู่แล้วและแค่ attach

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

  async createProductWithFiles(
    createProductDto: CreateProductDto,
    files: {
      heroImage: UploadedFileType[];
      productFile: UploadedFileType[];
      detailImages: UploadedFileType[];
    },
  ): Promise<{
    product: ProductWithImagesDto | null;
    uploadedFiles: { hero: string; file: string; details: string[] };
  }> {
    // 1. Create product first (with tags, category, owner relations)
    const product = await this.createProduct(createProductDto);
    const productId = product.id.toString();

    const uploadedFiles: {
      hero: string;
      file: string;
      details: string[];
    } = { hero: '', file: '', details: [] };

    // 2. Upload hero image
    const heroFile = files.heroImage[0];
    const heroTimestamp = Date.now();
    const heroFileName = `hero-${heroTimestamp}-${heroFile.originalname}`;

    await this.minioService.deleteFolder(
      MINIO_FOLDERS.PRODUCTS.HERO(productId),
    );

    const heroFullPath = await this.minioService.uploadFile(
      heroFile,
      heroFileName,
      MINIO_FOLDERS.PRODUCTS.HERO(productId),
    );
    const heroFileUrl = this.minioService.getFileUrl(heroFullPath);

    await this.updateHeroImage(product.id, heroFileUrl);
    uploadedFiles.hero = heroFileUrl;

    // 3. Upload product file (.zip)
    const productFile = files.productFile[0];

    // Validate .zip file
    const fileExtension = productFile.originalname
      .split('.')
      .pop()
      ?.toLowerCase();
    if (fileExtension !== 'zip') {
      throw new Error(
        `Invalid file type. Only .zip files are allowed. Received: .${fileExtension}`,
      );
    }

    const fileTimestamp = Date.now();
    const fileName = `uploaded-${fileTimestamp}-${productFile.originalname}`;

    await this.minioService.deleteFolder(
      MINIO_FOLDERS.PRODUCTS.UPLOAD(productId),
    );

    const fileFullPath = await this.minioService.uploadFile(
      productFile,
      fileName,
      MINIO_FOLDERS.PRODUCTS.UPLOAD(productId),
    );
    const fileUrl = this.minioService.getFileUrl(fileFullPath);

    await this.updateUploadedFilePath(product.id, fileUrl);
    uploadedFiles.file = fileUrl;

    // 4. Upload detail images (max 8)
    const detailFiles = files.detailImages;

    if (detailFiles.length > 8) {
      throw new Error('Maximum 8 detail images allowed');
    }

    for (const file of detailFiles) {
      const timestamp = Date.now();
      const detailFileName = `detail-${timestamp}-${file.originalname}`;

      const fullPath = await this.minioService.uploadFile(
        file,
        detailFileName,
        MINIO_FOLDERS.PRODUCTS.DETAILS(productId),
      );
      const detailFileUrl = this.minioService.getFileUrl(fullPath);

      await this.productImageService.create({
        path_image: fullPath,
        product_id: product.id,
      });

      uploadedFiles.details.push(detailFileUrl);

      // Small delay to ensure unique timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return {
      product: await this.getProductById(product.id),
      uploadedFiles,
    };
  }
}
