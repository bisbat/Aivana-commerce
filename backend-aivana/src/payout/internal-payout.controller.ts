import { Controller, Post, Body, Get } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { GeneratePayoutDto } from './dto/generate-payout.dto';

@Controller('internal/payouts')
export class InternalPayoutController {
  constructor(private readonly payoutService: PayoutService) { }

  @Post('generate')
  generate(@Body() dto: GeneratePayoutDto) {
    const start = new Date(`${dto.periodStart}T00:00:00Z`);
    const end = new Date(`${dto.periodEnd}T23:59:59Z`);

    return this.payoutService.generatePayout(start, end);
  }

}
