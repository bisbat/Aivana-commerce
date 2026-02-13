// ─── Dashboard Types ─────────────────────────────────────────────────────────
export interface SellerDashboard {
  totalRevenue: number;
  totalItemsSold: number;
  monthlyPerformance: MonthlyPerformance[];
  topSellingProducts: TopSellingProduct[];
}

export interface MonthlyPerformance {
  month: string;          // "2026-01", "2026-02"
  revenue: number;
  itemsSold: number;
  ordersCount: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  imageUrl: string | null;
  totalSold: number;
  revenue: number;
}