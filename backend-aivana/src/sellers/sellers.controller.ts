import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    console.log('Received CreateSellerDto:', createSellerDto);
    return this.sellersService.createSeller(createSellerDto);
  }

  @Get()
  getAllSellers() {
    return this.sellersService.getAllSellers();
  }
}
