export class SellerDashboardDto {
  totalRevenue: number;
  totalItemsSold: number;
  monthlyPerformance: MonthlyPerformanceDto[];
  topSellingProducts: TopSellingProductDto[];
}

export class MonthlyPerformanceDto {
  month: string;    
  revenue: number;        
  itemsSold: number;      
  ordersCount: number;    
}

export class TopSellingProductDto {
  productId: number;
  productName: string;
  imageUrl: string | null;
  totalSold: number;     
  revenue: number;
}