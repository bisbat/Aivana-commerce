import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductImageService } from './product-image.service';
import { MinioService } from '../minio/minio.service';
import type { UploadedFileType } from '../products/interfaces/uploaded-file.interface';
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';
import { ProductsService } from '../products/products.service';

@Controller('product-images')
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly minioService: MinioService,
    private readonly productsService: ProductsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 8)) // Max 8 images per upload
  async uploadProductImages(
    @UploadedFiles() files: UploadedFileType[],
    @Body('product_id') productId: string,
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    // Check existing images count
    const existingImages = await this.productImageService.findByProductId(
      parseInt(productId),
    );
    const currentCount = existingImages.length;
    const newFilesCount = files.length;
    const totalCount = currentCount + newFilesCount;

    // Limit to 8 images total per product
    if (totalCount > 8) {
      throw new Error(
        `Cannot upload ${newFilesCount} images. Product already has ${currentCount} image(s). Maximum 8 images allowed per product.`,
      );
    }

    const uploadedImages: Array<{
      image_id: number;
      path_image: string;
      url: string;
    }> = [];

    // Upload each file to MinIO and save to database
    for (const file of files) {
      const timestamp = Date.now();
      const fileName = `detail-${timestamp}-${file.originalname}`;

      // Upload to MinIO with product-specific folder
      const fullPath = await this.minioService.uploadFile(
        file,
        fileName,
        MINIO_FOLDERS.PRODUCTS.DETAILS(productId),
      );
      const fileUrl = this.minioService.getFileUrl(fullPath);

      // Save to database
      const productImage = await this.productImageService.create({
        path_image: fullPath,
        product_id: parseInt(productId),
      });

      uploadedImages.push({
        image_id: productImage.image_id,
        path_image: productImage.path_image,
        url: fileUrl,
      });

      // Add small delay to ensure unique timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return {
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      product_id: parseInt(productId),
      total_images: totalCount,
      images: uploadedImages,
    };
  }

  @Delete(':imageId')
  async deleteProductImage(@Param('imageId') imageId: string) {
    const image = await this.productImageService.findOne(parseInt(imageId));

    if (!image) {
      throw new Error(`Image with ID ${imageId} not found`);
    }

    // Delete from MinIO
    try {
      await this.minioService.deleteFile(image.path_image);
    } catch (error) {
      console.error('Failed to delete image from MinIO:', error);
    }

    // Delete from database
    await this.productImageService.remove(parseInt(imageId));

    return {
      message: 'Product image deleted successfully',
      image_id: imageId,
    };
  }

  @Post('hero')
  @UseInterceptors(FileInterceptor('image'))
  async uploadHeroImage(
    @UploadedFile() file: UploadedFileType,
    @Body('product_id') productId: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Get product to check if hero image already exists
    const product = await this.productsService.findOne(parseInt(productId));

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Delete all files in the hero folder to ensure only one file exists
    const heroFolder = MINIO_FOLDERS.PRODUCTS.HERO(productId);
    try {
      await this.minioService.deleteFolder(heroFolder);
      console.log(`Cleared all files from ${heroFolder}`);
    } catch (error) {
      console.error('Failed to clear hero folder from MinIO:', error);
    }

    const timestamp = Date.now();
    const fileName = `hero-${timestamp}-${file.originalname}`;

    // Upload to MinIO with product-specific hero folder
    const fullPath = await this.minioService.uploadFile(
      file,
      fileName,
      MINIO_FOLDERS.PRODUCTS.HERO(productId),
    );
    const fileUrl = this.minioService.getFileUrl(fullPath);

    // Update hero_image_url in ProductEntity
    await this.productsService.updateHeroImage(parseInt(productId), fileUrl);

    return {
      message: 'Hero image uploaded successfully',
      product_id: parseInt(productId),
      fileName: fullPath,
      url: fileUrl,
    };
  }

  @Get('product/:productId')
  async getProductImages(@Param('productId') productId: string) {
    const images = await this.productImageService.findByProductId(
      parseInt(productId),
    );

    const imagesWithUrls = images.map((image) => ({
      image_id: image.image_id,
      path_image: image.path_image,
      url: this.minioService.getFileUrl(image.path_image),
    }));

    return {
      product_id: productId,
      images: imagesWithUrls,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImageService.findOne(+id);
  }
}
