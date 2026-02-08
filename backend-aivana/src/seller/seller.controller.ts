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
  constructor(private readonly sellerService: SellerService) {}

  @Post('upgrade/:userId')
  @Roles(Role.CUSTOMER)
  upgradeToSeller(
    @Param('userId') userId: string,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    return this.sellerService.upgradeToSeller(userId, createSellerDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllSellers() {
    return this.sellerService.getAllSellers();
  }

  @Get(':sellerId')
  @Roles(Role.SELLER, Role.ADMIN)
  getSellerById(@Param('sellerId') sellerId: string) {
    return this.sellerService.getSellerById(sellerId);
  }

  @Get('username/:username')
  @Public()
  getSellerByUsername(@Param('username') username: string) {
    return this.sellerService.getSellerByUsername(username);
  }

  @Public()
  @Get(':sellerId/products')
  getProductsBySellerId(@Param('sellerId') sellerId: string) {
    return this.sellerService.getProductsBySellerId(sellerId);
  }

  @Put(':sellerId')
  @Roles(Role.SELLER)
  updateSellerProfile(
    @Param('sellerId') sellerId: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellerService.updateSellerProfile(sellerId, updateSellerDto);
  }

  @Roles(Role.SELLER)
  @Get('earnings/summary/:sellerId')
  getSellerEarningsSummary( @Param('sellerId') sellerId: string
  ) {
    return this.sellerService.getSellerEarningsSummary(sellerId);  
  }

  @Roles(Role.SELLER)
  @Get('earnings/round/:sellerId')
  getSellerEarningsRound( @Param('sellerId') sellerId: string
  ) {
    return this.sellerService.getSellerEarningsRound(sellerId);  
  }


}