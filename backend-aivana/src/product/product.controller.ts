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
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
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
  async getProducts(
    @Query('tag') tag?: string,
    @Query('category') category?: string,
  ) {
    if (tag) {
      return this.productService.getProductsByTag(tag);
    }
    if (category) {
      return this.productService.getProductsByCategory(category);
    }
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
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    if (userRole === Role.ADMIN) {
      const product = await this.productService.getProductById(id, {
        includeHidden: true,
      });

      if (!product) throw new NotFoundException('Product not found');
      return product;
    }

    if (userRole === Role.SELLER) {
      const product = await this.productService.getProductById(id, {
        includeHidden: true,
      });
      if (!product) throw new NotFoundException('Product not found');

      if (product.isHidden || product.isDeleted) {
        const isOwner = product?.seller?.userId === userId;
        if (!isOwner) throw new NotFoundException('Product not found');
      }

      return product;
    }

    const product = await this.productService.getProductById(id, {
      includeHidden: true,
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.isHidden || product.isDeleted) {
      if (!userId) throw new NotFoundException('Product not found');

      const hasPurchased = await this.orderService.hasUserPurchasedProduct(
        userId,
        id,
      );

      if (!hasPurchased) throw new NotFoundException('Product not found');
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

  @Get(':id/has-orders')
  @Roles(Role.SELLER, Role.ADMIN)
  async checkProductHasOrders(@Param('id') id: number) {
    const hasOrders = await this.productService.hasProductOrders(id);
    return { hasOrders };
  }


  @Delete(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  async deleteProduct(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: { reason?: string },
  ) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const reason = body?.reason || 'ไม่ระบุเหตุผล';

    if (userRole === Role.SELLER) {
      const product = await this.productService.getProductById(id, {
        includeHidden: true,
      });

      if (!product) throw new NotFoundException('Product not found');

      const isOwner = product?.seller?.userId === userId;
      if (!isOwner)
        throw new ForbiddenException('You cannot delete this product');
    }

    const hasOrders = await this.productService.hasProductOrders(id);
    if (hasOrders) {
      await this.productService.deleteProduct(id, reason);
    } else {
      await this.productService.hardDeleteProduct(id);
    }
    return { message: 'Product deleted successfully', hardDeleted: !hasOrders };
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
