import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { MinioService } from '../minio/minio.service';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';
import type { UploadedFileType } from './interfaces/uploaded-file.interface';
import { ProductImageService } from '../product-image/product-image.service';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { SellerEntity } from 'src/sellers/entities/seller.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseProductDto } from './dto/response-product.dto';

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
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async getAllProducts(): Promise<ResponseProductDto[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'seller', 'tags', 'productImages'],
    });

    return products.map(product => {
      // Transform productImages to detailImages with URLs
      const detailImages = product.productImages?.map(image => ({
        imageId: image.imageId.toString(),
        url: this.minioService.getFileUrl(image.pathImage)
      })) || [];

      // Transform tags to ResponseTagDto format
      const tags = product.tags?.map(tag => ({
        id: tag.id,
        name: tag.name
      })) || [];

      // Transform category to ResponseCategoryDto format
      const category = product.category ? {
        id: product.category.id,
        name: product.category.name
      } : null;

      // Prepare data for transformation
      const productData = {
        ...product,
        id: product.id.toString(),
        sellerId: product.seller?.id,
        category,
        tags,
        detailImages
      };

      return plainToInstance(ResponseProductDto, productData, {
        excludeExtraneousValues: true
      });
    });
  }

  async findOne(productId: number): Promise<ResponseProductDto | null> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'seller', 'tags', 'productImages'],
    });

    if (!product) {
      return null;
    }

    // Transform productImages to detailImages with URLs
    const detailImages = product.productImages?.map(image => ({
      imageId: image.imageId.toString(),
      url: this.minioService.getFileUrl(image.pathImage)
    })) || [];

    // Transform tags to ResponseTagDto format
    const tags = product.tags?.map(tag => ({
      id: tag.id,
      name: tag.name
    })) || [];

    // Transform category to ResponseCategoryDto format
    const category = product.category ? {
      id: product.category.id,
      name: product.category.name
    } : null;

    // Prepare data for transformation
    const productData = {
      ...product,
      id: product.id.toString(),
      sellerId: product.seller?.id,
      category,
      tags,
      detailImages
    };

    return plainToInstance(ResponseProductDto, productData, {
      excludeExtraneousValues: true
    });
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { tagIds, categoryId, sellerId, ...productData } = createProductDto;

    // 1. Prevent duplicate product name under same seller
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

    // 2. Validate seller
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} not found`);
    }

    // 3. Validate category
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // 4. Validate tag IDs
    let tags: TagEntity[] = [];
    if (tagIds?.length) {
      tags = await this.tagRepository.findBy({ id: In(tagIds) });

      if (tags.length !== tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    // 5. Create & save product
    const product = this.productsRepository.create({
      ...productData,
      seller,
      category,
      tags,
    });

    return await this.productsRepository.save(product);
  }


  async updateHeroImage(
    productId: number,
    heroImageUrl: string,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category', 'seller', 'productImages'],
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
      relations: ['category', 'seller', 'tags', 'productImages'],
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

  async getProductById(id: number): Promise<ResponseProductDto | null> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'seller', 'productImages', 'tags'],
    });

    if (!product) return null;

    // แปลง productImages → detailImages (เติม URL จาก Minio)
    const detailImages = product.productImages?.map((image) => ({
      imageId: image.imageId.toString(),
      url: this.minioService.getFileUrl(image.pathImage),
    })) || [];

    const tags = product.tags?.map(tag => ({
      id: tag.id,
      name: tag.name
    })) || [];

    // inject detailImages เข้าไปใน product object และแปลงข้อมูล
    const productWithDetailImages = {
      ...product,
      id: product.id.toString(),
      categoryId: product.category?.id,
      sellerId: product.seller?.id,
      tags,
      detailImages,
    };

    return plainToInstance(ResponseProductDto, productWithDetailImages, {
      excludeExtraneousValues: true,
    });
  }


  async createProductWithFiles(
    createProductDto: CreateProductDto,
    files: {
      heroImage: UploadedFileType[];
      productFile: UploadedFileType[];
      detailImages: UploadedFileType[];
    },
  ): Promise<{ product: ResponseProductDto | null }> {
    // 1. Create product first (with tags, category, owner relations)
    const product = await this.createProduct(createProductDto);
    const productId = product.id.toString();

    /* ------------------------------------------------------
     * 2. Upload hero image
     * ------------------------------------------------------ */
    const heroFile = files.heroImage[0];
    const heroTimestamp = Date.now();
    const heroFileName = `hero-${heroTimestamp}-${heroFile.originalname}`;

    // Clear old hero folder
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

    /* ------------------------------------------------------
     * 3. Upload product file (.zip)
     * ------------------------------------------------------ */
    const productFile = files.productFile[0];
    const fileExtension = productFile.originalname.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'zip') {
      throw new Error(`Invalid file type. Only .zip allowed. Received .${fileExtension}`);
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

    /* ------------------------------------------------------
     * 4. Upload detail images (min 2, max 8)
     * ------------------------------------------------------ */
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

      // Make sure timestamps differ
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    /* ------------------------------------------------------
     * 5. Final response → return DTO format
     * ------------------------------------------------------ */
    const savedProduct = await this.getProductById(product.id);

    return {
      product: savedProduct,
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
  ): Promise<{ product: ResponseProductDto | null }> {

    /* ------------------------------------------------------
     * 1. Update basic product fields first
     * ------------------------------------------------------ */
    const product = await this.updateProduct(id, updateProductDto);
    const productId = product.id.toString();

    /* ------------------------------------------------------
     * 2. Update hero image if new file provided
     * ------------------------------------------------------ */
    if (files?.heroImage?.length) {
      const heroFile = files.heroImage[0];
      const heroTimestamp = Date.now();
      const heroFileName = `hero-${heroTimestamp}-${heroFile.originalname}`;

      // Clean old hero folder
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

    /* ------------------------------------------------------
     * 3. Update uploaded .zip file
     * ------------------------------------------------------ */
    if (files?.productFile?.length) {
      const productFile = files.productFile[0];
      const fileExtension = productFile.originalname.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'zip') {
        throw new Error(`Invalid file type. Only .zip allowed. Received .${fileExtension}`);
      }

      const timestamp = Date.now();
      const fileName = `uploaded-${timestamp}-${productFile.originalname}`;

      // Clean old uploaded folder
      await this.minioService.deleteFolder(
        MINIO_FOLDERS.PRODUCTS.UPLOAD(productId),
      );

      const fullPath = await this.minioService.uploadFile(
        productFile,
        fileName,
        MINIO_FOLDERS.PRODUCTS.UPLOAD(productId),
      );

      const fileUrl = this.minioService.getFileUrl(fullPath);
      await this.updateUploadedFilePath(product.id, fileUrl);
    }

    /* ------------------------------------------------------
     * 4. Add new detail images (validate min/max count)
     * ------------------------------------------------------ */
    if (files?.detailImages?.length) {
      const detailFiles = files.detailImages;

      const existing = await this.productsRepository.findOne({
        where: { id },
        relations: ['productImages'],
      });

      const existingCount = existing?.productImages?.length || 0;
      const totalCount = existingCount + detailFiles.length;

      if (totalCount < 2) {
        throw new Error(`Product must have at least 2 detail images.`);
      }
      if (totalCount > 8) {
        throw new Error(
          `Too many images. Already ${existingCount}. Adding ${detailFiles.length} causes total ${totalCount}, max is 8.`,
        );
      }

      // Upload new images
      for (const file of detailFiles) {
        const ts = Date.now();
        const detailFileName = `detail-${ts}-${file.originalname}`;

        const fullPath = await this.minioService.uploadFile(
          file,
          detailFileName,
          MINIO_FOLDERS.PRODUCTS.DETAILS(productId),
        );

        await this.productImageService.create({
          pathImage: fullPath,
          productId: product.id,
        });

        await new Promise((r) => setTimeout(r, 10)); // ensure unique timestamps
      }
    }

    /* ------------------------------------------------------
     * 5. Load updated product + convert to Response DTO
     * ------------------------------------------------------ */
    const updatedProduct = await this.getProductById(product.id);

    return {
      product: updatedProduct
        ? plainToInstance(ResponseProductDto, updatedProduct, {
          excludeExtraneousValues: true,
        })
        : null,
    };
  }
}
