import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import type { UploadedFileType } from './interfaces/uploaded-file.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductWithImagesDto } from './interfaces/product-with-images.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post('with-files')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'heroImage', maxCount: 1 },
      { name: 'productFile', maxCount: 1 },
      { name: 'detailImages', maxCount: 8 },
    ]),
  )
  async createProductWithFiles(
    @Body() body: Record<string, string>,
    @UploadedFiles()
    files: {
      heroImage?: UploadedFileType[];
      productFile?: UploadedFileType[];
      detailImages?: UploadedFileType[];
    },
  ) {
    if (!files.heroImage || files.heroImage.length === 0) {
      throw new Error('Hero image is required');
    }
    if (!files.productFile || files.productFile.length === 0) {
      throw new Error('Product file is required');
    }
    if (!files.detailImages || files.detailImages.length < 2) {
      throw new Error('At least 2 detail images are required');
    }
    if (files.detailImages.length > 8) {
      throw new Error('Maximum 8 detail images allowed');
    }
    const createProductDto: CreateProductDto = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      blurb: body.blurb,
      installation_guide: body.installation_guide,
      features: JSON.parse(body.features) as string[],
      compatibility: JSON.parse(body.compatibility) as string[],
      categoryId: parseInt(body.categoryId, 10),
      ownerId: parseInt(body.ownerId, 10),
      tagIds: body.tagIds ? (JSON.parse(body.tagIds) as number[]) : undefined,
    };

    const result = await this.productsService.createProductWithFiles(
      createProductDto,
      {
        heroImage: files.heroImage,
        productFile: files.productFile,
        detailImages: files.detailImages,
      },
    );

    return {
      message: 'Product created successfully with all files',
      ...result,
    };
  }

  @Get(':id')
  async getProductById(
    @Param('id') id: number,
  ): Promise<ProductWithImagesDto | null> {
    return this.productsService.getProductById(id);
  }

  @Put(':id/with-files')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'heroImage', maxCount: 1 },
      { name: 'productFile', maxCount: 1 },
      { name: 'detailImages', maxCount: 8 },
    ]),
  )
  async updateProductWithFiles(
    @Param('id') id: number,
    @Body() body: Record<string, string>,
    @UploadedFiles()
    files?: {
      heroImage?: UploadedFileType[];
      productFile?: UploadedFileType[];
      detailImages?: UploadedFileType[];
    },
  ) {
    const updateProductDto: UpdateProductDto = {
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.price && { price: parseFloat(body.price) }),
      ...(body.blurb && { blurb: body.blurb }),
      ...(body.installation_guide && {
        installation_guide: body.installation_guide,
      }),
      ...(body.features && {
        features: JSON.parse(body.features) as string[],
      }),
      ...(body.compatibility && {
        compatibility: JSON.parse(body.compatibility) as string[],
      }),
      ...(body.categoryId && { categoryId: parseInt(body.categoryId, 10) }),
      ...(body.ownerId && { ownerId: parseInt(body.ownerId, 10) }),
      ...(body.tagIds && { tagIds: JSON.parse(body.tagIds) as number[] }),
    };

    const result = await this.productsService.updateProductWithFiles(
      id,
      updateProductDto,
      files,
    );

    return {
      message: 'Product updated successfully',
      ...result,
    };
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}
