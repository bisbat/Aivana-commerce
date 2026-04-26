// DTO for the response
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
  price: number;           // ราคาขาย
  commission: number;      // ค่าธรรมเนียม
  sellerEarning: number;   // เงินที่ seller ได้รับจริง
}