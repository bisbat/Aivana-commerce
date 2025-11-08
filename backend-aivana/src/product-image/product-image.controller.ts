import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  Get,
  // Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductImageService } from './product-image.service';
import { MinioService } from '../minio/minio.service';
import type { UploadedFileType } from '../common/interfaces/uploaded-file.interface';
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';

@Controller('product-images')
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly minioService: MinioService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @UploadedFile() file: UploadedFileType,
    @Body('product_id') productId: string,
  ) {
    const timestamp = Date.now();
    const fileName = `detail-${timestamp}-${file.originalname}`;

    // Upload to MinIO with product-specific folder
    const fullPath = await this.minioService.uploadFile(
      file,
      fileName,
      MINIO_FOLDERS.PRODUCTS.DETAILS(productId),
    );
    const fileUrl = await this.minioService.getFileUrl(fullPath);

    // Save to database
    const productImage = await this.productImageService.create({
      path_image: fullPath,
      product_id: parseInt(productId),
    });

    return {
      message: 'Product image uploaded successfully',
      image_id: productImage.image_id,
      path_image: productImage.path_image,
      url: fileUrl,
    };
  }

  @Post('hero')
  @UseInterceptors(FileInterceptor('image'))
  async uploadHeroImage(
    @UploadedFile() file: UploadedFileType,
    @Body('product_id') productId: string,
  ) {
    const timestamp = Date.now();
    const fileName = `hero-${timestamp}-${file.originalname}`;

    // Upload to MinIO with product-specific hero folder
    const fullPath = await this.minioService.uploadFile(
      file,
      fileName,
      MINIO_FOLDERS.PRODUCTS.HERO(productId),
    );
    const fileUrl = await this.minioService.getFileUrl(fullPath);

    return {
      message: 'Hero image uploaded successfully',
      fileName: fullPath,
      url: fileUrl,
    };
  }

  @Post('preview-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPreviewFile(
    @UploadedFile() file: UploadedFileType,
    @Body('product_id') productId: string,
  ) {
    const timestamp = Date.now();
    const fileName = `preview-${timestamp}-${file.originalname}`;

    // Upload to MinIO with product-specific files folder
    const fullPath = await this.minioService.uploadFile(
      file,
      fileName,
      MINIO_FOLDERS.PRODUCTS.FILES(productId),
    );
    const fileUrl = await this.minioService.getFileUrl(fullPath);

    return {
      message: 'Preview file uploaded successfully',
      fileName: fullPath,
      url: fileUrl,
    };
  }

  @Get('product/:productId')
  async getProductImages(@Param('productId') productId: string) {
    const images = await this.productImageService.findByProductId(
      parseInt(productId),
    );

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => ({
        image_id: image.image_id,
        path_image: image.path_image,
        url: await this.minioService.getFileUrl(image.path_image),
      })),
    );

    return {
      product_id: productId,
      images: imagesWithUrls,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImageService.findOne(+id);
  }

  // @Delete(':imageId')
  // async deleteProductImage(@Param('imageId') imageId: string) {
  //   const image = await this.productImageService.findOne(parseInt(imageId));

  //   if (image) {
  //     // Delete from MinIO
  //     await this.minioService.deleteFile(image.path_image);

  //     // Delete from database
  //     await this.productImageService.remove(parseInt(imageId));
  //   }

  //   return {
  //     message: 'Product image deleted successfully',
  //     image_id: imageId,
  //   };
  // }
}
