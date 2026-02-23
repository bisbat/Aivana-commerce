import { Controller, Post, Body, Get } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { GeneratePayoutDto } from './dto/generate-payout.dto';

@Controller('internal/payouts')
export class InternalPayoutController {
  constructor(private readonly payoutService: PayoutService) { }

  @Post('generate')
  generate(@Body() dto: GeneratePayoutDto) {
    return this.payoutService.generateManualPayout(
      dto.periodStart,
      dto.periodEnd,
    );
  }


}
