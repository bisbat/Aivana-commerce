// ─── Summary (top cards) ─────────────────────────────────────────────────────
export interface SellerEarningsSummary {
  paidAmount: number;
  pendingAmount: number;
}

// ─── Single round (table row) ───────────────────────────────────────────────
export interface SellerEarningsRound {
  periodStart: string;
  periodEnd: string;
  grossSales: number;
  commission: number;
  netAmount: number;
  status: "paid" | "pending";
  slipUrl: string | null;
}
