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
import type { UploadedFileType } from './interfaces/uploaded-file.interface';
import { MinioService } from '../minio/minio.service';
import { MINIO_FOLDERS } from '../constants/minio-folders.constant';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductWithImagesDto } from './interfaces/product-with-images.interface';

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

  @Post('uploaded-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductFile(
    @UploadedFile() file: UploadedFileType,
    @Body('product_id') productId: string,
  ) {
    console.log('=== Upload Debug ===');
    console.log('Received file:', file);
    console.log('Received product_id:', productId);
    console.log('File type:', typeof file);
    console.log('===================');

    if (!file) {
      throw new Error(
        'No file uploaded. Make sure the key name is "file" and type is File (not Text) in Postman form-data',
      );
    }

    // Validate file type - only accept .zip files
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'zip') {
      throw new Error(
        `Invalid file type. Only .zip files are allowed. Received: .${fileExtension}`,
      );
    }

    // Get product to check if uploaded file already exists
    const product = await this.productsService.findOne(parseInt(productId));

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Delete old uploaded file from MinIO if exists
    if (product.uploaded_file_path) {
      try {
        const url = new URL(product.uploaded_file_path);
        const pathParts = url.pathname.split('/');
        const bucketName = process.env.MINIO_BUCKET_NAME || 'aivana-commerce';
        const bucketIndex = pathParts.indexOf(bucketName);
        if (bucketIndex !== -1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          await this.minioService.deleteFile(filePath);
        }
      } catch (error) {
        console.error('Failed to delete old uploaded file from MinIO:', error);
      }
    }

    const timestamp = Date.now();
    const fileName = `uploaded-${timestamp}-${file.originalname}`;

    // Upload new file to MinIO
    const fullPath = await this.minioService.uploadFile(
      file,
      fileName,
      MINIO_FOLDERS.PRODUCTS.UPLOAD(productId),
    );
    const fileUrl = this.minioService.getFileUrl(fullPath);

    // Update uploaded_file_path in ProductEntity
    await this.productsService.updateUploadedFilePath(
      parseInt(productId),
      fileUrl,
    );

    return {
      message: 'Product file uploaded successfully',
      product_id: parseInt(productId),
      fileName: fullPath,
      url: fileUrl,
    };
  }

  @Get(':id')
  async getProductById(
    @Param('id') id: number,
  ): Promise<ProductWithImagesDto | null> {
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
