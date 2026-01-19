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
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('seller')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post('upgrade/:userId')
  @Roles(Role.CUSTOMER)
  upgradeToSeller(
    @Param('userId') userId: string,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    return this.sellersService.upgradeToSeller(userId, createSellerDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllSellers() {
    return this.sellersService.getAllSellers();
  }

  @Get(':sellerId')
  @Roles(Role.SELLER, Role.ADMIN)
  getSellerById(@Param('sellerId') sellerId: string) {
    return this.sellersService.getSellerById(sellerId);
  }

  @Get(':sellerId/products')
  @Roles(Role.SELLER, Role.ADMIN)
  getProductsBySellerId(@Param('sellerId') sellerId: string) {
    return this.sellersService.getProductsBySellerId(sellerId);
  }

  @Put(':sellerId')
  @Roles(Role.SELLER)
  updateSellerProfile(
    @Param('sellerId') sellerId: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellersService.updateSellerProfile(sellerId, updateSellerDto);
  }
}
