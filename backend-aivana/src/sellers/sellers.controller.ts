import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('sellers')
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

  @Get(':username')
  getSellerById(@Param('username') username: string) {
    return this.sellersService.getSellerByUsername(username);
  }
}
