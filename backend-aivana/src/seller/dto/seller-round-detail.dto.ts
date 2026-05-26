export class SellerRoundDetailDto {
  payoutId: number;
  periodStart: string;
  periodEnd: string;
  totalGrossSales: number;
  totalCommission: number;
  totalNetAmount: number;
  items: SellerRoundItemDto[];
}

export class SellerRoundItemDto {
  productName: string;
  price: number;         
  commission: number;     
  sellerEarning: number;   
}