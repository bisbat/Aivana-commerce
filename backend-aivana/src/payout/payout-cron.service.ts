import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PayoutService } from './payout.service';

@Injectable()
export class PayoutCronService {
    constructor(private readonly payoutService: PayoutService) { }

    @Cron('0 5 0 1,16 * *', { timeZone: 'Asia/Bangkok' })
    async handleHalfMonthPayout() {
        const now = new Date();
        const day = now.getDate();

        let start: Date;
        let end: Date;

        if (day === 1) {
            // รอบ 16 → สิ้นเดือนที่แล้ว
            start = new Date(now.getFullYear(), now.getMonth() - 1, 16);
            end = new Date(now.getFullYear(), now.getMonth(), 0); // last day prev month
        } else {
            // วันที่ 16 → รอบ 1 → 15 ของเดือนนี้
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth(), 15);
        }

        console.log('AUT0 PAY0UT range:', start, '→', end);

        try {
            await this.payoutService.generatePayout(
                start.toISOString(),
                end.toISOString(),
            );
        } catch (e) {
            console.error('Payout cron error:', e.message);
        }
    }

}
