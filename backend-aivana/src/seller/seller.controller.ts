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
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('seller')
export class SellerController {
  constructor(private readonly SellerService: SellerService) {}

  @Post('upgrade/:userId')
  @Roles(Role.CUSTOMER)
  upgradeToSeller(
    @Param('userId') userId: string,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    return this.SellerService.upgradeToSeller(userId, createSellerDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllSellers() {
    return this.SellerService.getAllSellers();
  }

  @Get(':sellerId')
  @Roles(Role.SELLER, Role.ADMIN)
  getSellerById(@Param('sellerId') sellerId: string) {
    return this.SellerService.getSellerById(sellerId);
  }

  @Get(':sellerId/products')
  @Roles(Role.SELLER, Role.ADMIN)
  getProductsBySellerId(@Param('sellerId') sellerId: string) {
    return this.SellerService.getProductsBySellerId(sellerId);
  }

  @Put(':sellerId')
  @Roles(Role.SELLER)
  updateSellerProfile(
    @Param('sellerId') sellerId: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.SellerService.updateSellerProfile(sellerId, updateSellerDto);
  }
}
