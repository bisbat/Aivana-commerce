export interface SellerEarningsSummary {
  paidAmount: number;
  pendingAmount: number;
}
export interface SellerEarningsRound {
  payoutId: number; 
  periodStart: string;
  periodEnd: string;
  grossSales: number;
  commission: number;
  netAmount: number;
  status: "paid" | "pending";
  slipUrl: string | null;
}
