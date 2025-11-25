import { Injectable, NotFoundException } from '@nestjs/common';
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
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { SellerEntity } from 'src/sellers/entities/seller.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private minioService: MinioService,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    private productImageService: ProductImageService,
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
  ) { }

  async getAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'seller', 'tags'],
    });
    return products;
  }

  async findOne(productId: number): Promise<ProductEntity | null> {
    return await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'seller', 'tags'],
    });
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { tagIds, categoryId, sellerId, ...productData } = createProductDto;

    // Check if seller already has a product with this name
    const existingProduct = await this.productsRepository.findOne({
      where: {
        name: productData.name,
        seller: { id: sellerId },
      },
    });

    if (existingProduct) {
      throw new Error(
        `You already have a product named "${productData.name}". Please use a different name.`,
      );
    }

    // หา tags
    const tags = tagIds
      ? await this.tagRepository.findBy({ id: In(tagIds) })
      : [];
    if (tagIds && tags.length !== tagIds.length) {
        throw new NotFoundException('One or more tags not found');    }

    // preload category และ seller
    const category = { id: categoryId }; // ถ้า category มีอยู่แล้วและแค่ต้อง attach
    const seller = await this.sellerRepository.findOne({ where: { id: sellerId } });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} not found`);
    }
    const product = this.productsRepository.create({
      ...productData,
      tags,
      category,
      seller,
    });

    return await this.productsRepository.save(product);
  }

  async updateHeroImage(
    productId: number,
    heroImageUrl: string,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'seller'],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    product.heroImageUrl = heroImageUrl;
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

    const { tagIds, categoryId, sellerId, ...productData } = updateProductDto;

    // Update tags if provided
    if (tagIds) {
      const tags = await this.tagRepository.findBy({ id: In(tagIds) });
      if (tags.length !== tagIds.length) {
        throw new Error('One or more tags not found');
      }
      product.tags = tags;
    }

    // Update category if provided
    if (categoryId) {
      product.category = { id: categoryId } as CategoryEntity;
    }

    // Update seller if provided
    if (sellerId) {
      product.seller = { id: sellerId } as any; // Partial entity for relation
    }

    // Update other fields
    Object.assign(product, productData);

    await this.productsRepository.save(product);
    const updatedProduct = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'seller', 'tags'],
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
      relations: ['category', 'seller'],
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    product.uploadedFilePath = uploadedFilePath;
    await this.productsRepository.save(product);

    return product;
  }

  async getProductById(id: number): Promise<ProductWithImagesDto | null> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'seller', 'product_images', 'tags'],
    });

    if (!product) {
      return null;
    }

    const detailImages =
      product.productImages?.map((image) => ({
        imageId: image.imageId,
        pathImage: image.pathImage,
        url: this.minioService.getFileUrl(image.pathImage),
      })) || [];

    // Remove product_images and add detail_images with URLs
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { productImages, ...productData } = product;

    return {
      ...productData,
      detailImages: detailImages,
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
  }> {
    // 1. Create product first (with tags, category, owner relations)
    const product = await this.createProduct(createProductDto);
    const productId = product.id.toString();

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

    // 4. Upload detail images (min 2, max 8)
    const detailFiles = files.detailImages;

    if (detailFiles.length < 2) {
      throw new Error('At least 2 detail images are required');
    }

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

      await this.productImageService.create({
        pathImage: fullPath,
        productId: product.id,
      });

      // Small delay to ensure unique timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return {
      product: await this.getProductById(product.id),
    };
  }

  async updateProductWithFiles(
    id: number,
    updateProductDto: UpdateProductDto,
    files?: {
      heroImage?: UploadedFileType[];
      productFile?: UploadedFileType[];
      detailImages?: UploadedFileType[];
    },
  ): Promise<{
    product: ProductWithImagesDto | null;
  }> {
    // 1. Update product data first
    const product = await this.updateProduct(id, updateProductDto);
    const productId = product.id.toString();

    // 2. Upload hero image if provided
    if (files?.heroImage && files.heroImage.length > 0) {
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
    }

    // 3. Upload product file (.zip) if provided
    if (files?.productFile && files.productFile.length > 0) {
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
    }

    // 4. Add detail images if provided (total max 8)
    if (files?.detailImages && files.detailImages.length > 0) {
      const detailFiles = files.detailImages;

      // Check existing detail images count
      const existingProduct = await this.productsRepository.findOne({
        where: { id },
        relations: ['productImages'],
      });

      const existingCount = existingProduct?.productImages?.length || 0;
      const totalCount = existingCount + detailFiles.length;

      if (totalCount < 2) {
        throw new Error(
          `Product must have at least 2 detail images. Currently has ${existingCount}, adding ${detailFiles.length}. Total would be ${totalCount}.`,
        );
      }

      if (totalCount > 8) {
        throw new Error(
          `Cannot add ${detailFiles.length} images. Product already has ${existingCount} detail images. Maximum total is 8 images.`,
        );
      }

      // Upload new detail images
      for (const file of detailFiles) {
        const timestamp = Date.now();
        const detailFileName = `detail-${timestamp}-${file.originalname}`;

        const fullPath = await this.minioService.uploadFile(
          file,
          detailFileName,
          MINIO_FOLDERS.PRODUCTS.DETAILS(productId),
        );

        await this.productImageService.create({
          pathImage: fullPath,
          productId: product.id,
        });

        // Small delay to ensure unique timestamps
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    return {
      product: await this.getProductById(product.id),
    };
  }
}
