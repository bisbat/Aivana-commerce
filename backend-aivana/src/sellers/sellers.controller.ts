import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('seller')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post('upgrade/:userId')
  upgradeToSeller(
    @Param('userId') userId: string,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    return this.sellersService.upgradeToSeller(userId, createSellerDto);
  }

  @Get()
  getAllSellers() {
    return this.sellersService.getAllSellers();
  }

  @Get(':sellerId')
  getSellerById(@Param('sellerId') sellerId: string) {
    return this.sellersService.getSellerById(sellerId);
  }

  @Get(':sellerId/products')
  getProductsBySellerId(@Param('sellerId') sellerId: string) {
    return this.sellersService.getProductsBySellerId(sellerId);
  }

  @Put(':sellerId')
  updateSellerProfile(
    @Param('sellerId') sellerId: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellersService.updateSellerProfile(sellerId, updateSellerDto);
  }
}
