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
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';
import { ProductService } from '../product/product.service';
import { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product-images')
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly minioService: MinioService,
    private readonly ProductService: ProductService,
  ) {}

  @Post('upload')
  @Roles(Role.SELLER)
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
      imageId: number;
      pathImage: string;
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
        pathImage: fullPath,
        productId: parseInt(productId),
      });

      uploadedImages.push({
        imageId: productImage.imageId,
        pathImage: productImage.pathImage,
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
  @Roles(Role.SELLER,Role.ADMIN)
  async deleteProductImage(@Param('imageId') imageId: string) {
    const image = await this.productImageService.findOne(parseInt(imageId));

    if (!image) {
      throw new Error(`Image with ID ${imageId} not found`);
    }

    // Delete from MinIO
    try {
      await this.minioService.deleteFile(image.pathImage);
    } catch (error) {
      console.error('Failed to delete image from MinIO:', error);
    }

    // Delete from database
    await this.productImageService.remove(parseInt(imageId));

    return {
      message: 'Product image deleted successfully',
      imageId: imageId,
    };
  }

  @Post('hero')
  @Roles(Role.SELLER)
  @UseInterceptors(FileInterceptor('image'))
  async uploadHeroImage(
    @UploadedFile() file: UploadedFileType[],
    @Body('product_id') productId: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Get product to check if hero image already exists
    const product = await this.ProductService.findOne(parseInt(productId));

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
    const fileName = `hero-${timestamp}-${file[0].originalname}`;

    // Upload to MinIO with product-specific hero folder
    const fullPath = await this.minioService.uploadFile(
      file[0],
      fileName,
      MINIO_FOLDERS.PRODUCTS.HERO(productId),
    );
    const fileUrl = this.minioService.getFileUrl(fullPath);

    // Update hero_image_url in ProductEntity
    await this.ProductService.updateHeroImage(parseInt(productId), fileUrl);

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
      imageId: image.imageId,
      pathImage: image.pathImage,
      url: this.minioService.getFileUrl(image.pathImage),
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
