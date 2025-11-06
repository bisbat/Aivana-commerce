import { Controller, Get, Param } from '@nestjs/common';
import { ProductImageService } from './product-image.service';

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImageService.findOne(+id);
  }
}
