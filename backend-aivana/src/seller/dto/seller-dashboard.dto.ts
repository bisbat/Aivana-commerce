// ─── Main Dashboard Response ─────────────────────────────────────────────────
export class SellerDashboardDto {
  totalRevenue: number;
  totalItemsSold: number;
  monthlyPerformance: MonthlyPerformanceDto[];
  topSellingProducts: TopSellingProductDto[];
}

// ─── Monthly Performance (for graph) ─────────────────────────────────────────
export class MonthlyPerformanceDto {
  month: string;          // "2026-01", "2026-02", etc.
  revenue: number;        // Total revenue for that month
  itemsSold: number;      // Total items sold
  ordersCount: number;    // Number of orders
}

// ─── Top Selling Products ────────────────────────────────────────────────────
export class TopSellingProductDto {
  productId: number;
  productName: string;
  imageUrl: string | null;
  totalSold: number;      // Quantity sold
  revenue: number;        // Total revenue from this product
}