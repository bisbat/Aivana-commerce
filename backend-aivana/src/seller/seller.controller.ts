import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
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

  @Get('dashboard')
  @Roles(Role.SELLER)
  getDashboard(@Req() req) {
    const userId = req.user.userId;
    return this.sellerService.getSellerDashboard(userId);
  }

  @Get('earnings/summary')
  @Roles(Role.SELLER)
  getMyEarningsSummary(@Req() req) {
    const userId = req.user.userId;
    return this.sellerService.getSellerEarningsSummaryByUserId(userId);
  }

  @Get('earnings/round')
  @Roles(Role.SELLER)
  getMyEarningsRound(@Req() req) {
    const userId = req.user.userId;
    return this.sellerService.getSellerEarningsRoundByUserId(userId);
  }

  @Get('earnings/round/payout/:payoutId')
  @Roles(Role.SELLER)
  getRoundDetail(@Req() req, @Param('payoutId') payoutId: string) {
    const userId = req.user.userId;
    return this.sellerService.getSellerRoundDetailByPayoutId(userId, payoutId);
  }

  @Get('username/:username')
  @Public()
  getSellerByUsername(@Param('username') username: string) {
    return this.sellerService.getSellerByUsername(username);
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

  @Get(':sellerId/products')
  @Public()
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

  @Get('earnings/summary/:sellerId')
  @Roles(Role.SELLER)
  getSellerEarningsSummary(@Param('sellerId') sellerId: string) {
    return this.sellerService.getSellerEarningsSummary(sellerId);
  }

  @Get('earnings/round/:sellerId')
  @Roles(Role.SELLER)
  getSellerEarningsRound(@Param('sellerId') sellerId: string) {
    return this.sellerService.getSellerEarningsRound(sellerId);
  }
}