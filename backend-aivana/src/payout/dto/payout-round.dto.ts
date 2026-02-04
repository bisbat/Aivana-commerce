export class PayoutRoundDto {
  periodStart: Date;
  periodEnd: Date;
  sellerCount: number;
  totalAmount: number;
  roundStatus: 'processing' | 'completed';
}
