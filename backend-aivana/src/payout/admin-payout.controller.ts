import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { Param, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import type { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';
import { BadRequestException } from '@nestjs/common/exceptions';


@Controller('admin/payouts')
export class AdminPayoutController {
  constructor(private readonly payoutService: PayoutService) { }

  @Get()
  getAllPayouts() {
    return this.payoutService.getAllPayoutsForAdmin();
  }

  @Get('rounds')
  async getPayoutRounds() {
    return this.payoutService.getPayoutRounds();
  }

  @UseInterceptors(FileInterceptor('slip'))
  @Patch(':id/mark-paid')
  async markPaid(
    @Param('id') id: number,
    @UploadedFile() slip: UploadedFileType,
  ) {
    return this.payoutService.markPaid(id, slip);
  }

  @Get("rounds/:start/:end")
  async getRoundDetail(
    @Param("start") start: string,
    @Param("end") end: string,
  ) {
    return this.payoutService.getRoundDetail(start, end);
  }

  @Get(':id')
  getPayoutDetail(@Param('id') id: string) {
    const payoutId = Number(id);

    if (isNaN(payoutId)) {
      throw new BadRequestException('Invalid payout id');
    }

    return this.payoutService.getPayoutDetailForAdmin(payoutId);
  }

  @Get('detail/:payoutId')
  async getSellerPayoutDetail(@Param('payoutId') payoutId: number) {
    return this.payoutService.getSellerPayoutDetail(Number(payoutId));
  }


}
