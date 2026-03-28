import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PayoutService } from './payout.service';
import { getHalfMonthRange } from './helpers/payout-date.helper';

@Injectable()
export class PayoutCronService {
    constructor(private readonly payoutService: PayoutService) { }

    @Cron('0 40 16 28 * *', { timeZone: 'Asia/Bangkok' })
    async handleHalfMonthPayout() {
        console.log('[CRON] Half-month payout triggered');
        const { start, end } = getHalfMonthRange(new Date());

        await this.payoutService.generatePayout(start, end);

    }

}
