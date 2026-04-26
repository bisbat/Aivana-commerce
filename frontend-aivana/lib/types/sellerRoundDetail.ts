export interface SellerRoundDetail {
  payoutId: number;
  periodStart: string;
  periodEnd: string;
  totalGrossSales: number;
  totalCommission: number;
  totalNetAmount: number;
  items: SellerRoundItem[];
}

export interface SellerRoundItem {
  productName: string;
  price: number;
  commission: number;
  sellerEarning: number;
}