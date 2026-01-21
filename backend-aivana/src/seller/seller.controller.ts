import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly SellerService: SellerService) {}

  @Post('upgrade/:userId')
  upgradeToSeller(
    @Param('userId') userId: string,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    return this.SellerService.upgradeToSeller(userId, createSellerDto);
  }

  @Get()
  getAllSellers() {
    return this.SellerService.getAllSellers();
  }

  @Get(':sellerId')
  getSellerById(@Param('sellerId') sellerId: string) {
    return this.SellerService.getSellerById(sellerId);
  }

  @Get(':sellerId/products')
  getProductsBySellerId(@Param('sellerId') sellerId: string) {
    return this.SellerService.getProductsBySellerId(sellerId);
  }

  @Put(':sellerId')
  updateSellerProfile(
    @Param('sellerId') sellerId: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.SellerService.updateSellerProfile(sellerId, updateSellerDto);
  }
}
