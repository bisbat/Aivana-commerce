import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import type { UploadedFileType } from '../common/interfaces/uploaded-file.interface';
import { MinioService } from '../minio/minio.service';
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly minioService: MinioService,
  ) {}

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Post('preview-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPreviewFile(
    @UploadedFile() file: UploadedFileType,
    @Body('product_id') productId: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Get product to check if preview file already exists
    const product = await this.productsService.findOne(parseInt(productId));

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Delete old preview file from MinIO if exists
    if (product.preview_url) {
      try {
        const url = new URL(product.preview_url);
        const pathParts = url.pathname.split('/');
        const bucketName = process.env.MINIO_BUCKET_NAME;
        if (!bucketName) {
          console.error(
            'MINIO_BUCKET_NAME is not set. Skipping deletion of old preview file.',
          );
        } else {
          const bucketIndex = pathParts.indexOf(bucketName);
          if (bucketIndex !== -1) {
            const filePath = pathParts.slice(bucketIndex + 1).join('/');
            await this.minioService.deleteFile(filePath);
          }
        }
      } catch (error) {
        console.error('Failed to delete old preview file from MinIO:', error);
      }
    }

    const timestamp = Date.now();
    const fileName = `preview-${timestamp}-${file.originalname}`;

    // Upload new file to MinIO
    const fullPath = await this.minioService.uploadFile(
      file,
      fileName,
      MINIO_FOLDERS.PRODUCTS.FILE(productId),
    );
    const fileUrl = this.minioService.getFileUrl(fullPath);

    // Update preview_url in ProductEntity
    await this.productsService.updatePreviewUrl(parseInt(productId), fileUrl);

    return {
      message: 'Preview file uploaded successfully',
      product_id: parseInt(productId),
      fileName: fullPath,
      url: fileUrl,
    };
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productsService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}
