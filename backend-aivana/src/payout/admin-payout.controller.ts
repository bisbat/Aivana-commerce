import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { Param, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import type { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';


@Controller('admin/payouts')
export class AdminPayoutController {
  constructor(private readonly payoutService: PayoutService) { }

  @Get()
  getAllPayouts() {
    return this.payoutService.getAllPayoutsForAdmin();
  }

  @Get(':id')
  getPayoutDetail(@Param('id') id: string) {
    return this.payoutService.getPayoutDetailForAdmin(+id);
  }

  @UseInterceptors(FileInterceptor('slip'))
  @Patch(':id/mark-paid')
  async markPaid(
    @Param('id') id: number,
    @UploadedFile() slip: UploadedFileType,
  ) {
    return this.payoutService.markPaid(id, slip);
  }

}
