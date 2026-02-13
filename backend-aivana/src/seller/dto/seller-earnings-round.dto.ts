export class SellerEarningsRoundDto {
  payoutId: number;
  periodStart: Date;
  periodEnd: Date;
  grossSales: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'paid';
  slipUrl?: string;
}
