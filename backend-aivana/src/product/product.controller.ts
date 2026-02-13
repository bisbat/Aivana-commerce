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
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import type { UploadedFileType } from './interfaces/uploaded-file.interface';
import { BadRequestException } from '@nestjs/common/exceptions';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Query } from '@nestjs/common/decorators';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { OrderService } from 'src/order/order.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  @Public()
  @Get()
  async getProducts(@Query('tag') tag?: string) {
    if (tag) {
      return this.productService.getProductsByTag(tag);
    }

    return this.productService.getAllProducts();
  }

  @Public()
  @Get()
  async getAllProducts(): Promise<ResponseProductDto[]> {
    return this.productService.getAllProducts();
  }

  @Post()
  @Roles(Role.SELLER)
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
    const validatedFiles = this.validateAndTypeFiles(files);

    const createProductDto = plainToInstance(CreateProductDto, body);

    const result = await this.productService.createProductWithFiles(
      createProductDto,
      validatedFiles,
    );

    return {
      message: 'Product created successfully with all files',
      ...result,
    };
  }

  @Public()
  @Get('search')
  search(@Query('q') q: string) {
    return this.productService.searchProducts(q);
  }

  @Public()
  @Get(':id')
  async getProductById(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<ResponseProductDto | null> {
    const product = await this.productService.getProductById(id);

    if (!product) {
      return null;
    }

    // ถ้าสินค้าถูกลบ และ user ไม่ได้ login หรือไม่เคยซื้อ -> ซ่อน
    if (product.isDeleted) {
      const userId = req.user?.userId;

      // ถ้าไม่ได้ login -> return null
      if (!userId) {
        return null;
      }

      // เช็คว่า user เคยซื้อสินค้านี้หรือไม่
      const hasPurchased = await this.orderService.hasUserPurchasedProduct(
        userId,
        id,
      );

      // ถ้าไม่เคยซื้อ -> return null
      if (!hasPurchased) {
        return null;
      }
    }

    return product;
  }

  @Put(':id')
  @Roles(Role.SELLER)
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
    @Req() req: any,
    @UploadedFiles()
    files?: {
      heroImage?: UploadedFileType[];
      productFile?: UploadedFileType[];
      detailImages?: UploadedFileType[];
    },
  ) {
    const userId = req.user.userId;
    const updateProductDto = plainToInstance(UpdateProductDto, body);

    const result = await this.productService.updateProductWithFiles(
      id,
      userId,
      updateProductDto,
      files,
    );

    return {
      message: 'Product updated successfully',
      ...result,
    };
  }

  @Delete(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  async deleteProduct(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: { reason?: string },
  ) {
    const reason = body?.reason || 'ไม่ระบุเหตุผล';
    await this.productService.deleteProduct(id, reason, req.user.userId);
    return { message: 'Product deleted successfully' };
  }

  private validateAndTypeFiles(files: {
    heroImage?: UploadedFileType[];
    productFile?: UploadedFileType[];
    detailImages?: UploadedFileType[];
  }): {
    heroImage: UploadedFileType[];
    productFile: UploadedFileType[];
    detailImages: UploadedFileType[];
  } {
    if (!files.heroImage?.length) {
      throw new BadRequestException('Hero image is required');
    }
    if (!files.productFile?.length) {
      throw new BadRequestException('Product file is required');
    }
    if (!files.detailImages || files.detailImages.length < 2) {
      throw new BadRequestException('At least 2 detail images are required');
    }
    if (files.detailImages.length > 8) {
      throw new BadRequestException('Maximum 8 detail images allowed');
    }

    return {
      heroImage: files.heroImage,
      productFile: files.productFile,
      detailImages: files.detailImages,
    };
  }

  @Public()
  @Get(':id/reviews')
  async getProductReviews(@Param('id') id: number) {
    return this.productService.getProductReviews(id);
  }
}
