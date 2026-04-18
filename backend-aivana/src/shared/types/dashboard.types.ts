export type SentimentLabel = 'pos' | 'neu' | 'neg';

export interface DashboardStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  avg_confidence: number;
  period_days: number;
}

export interface TrendPoint {
  week: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface ReviewItem {
  id: string;
  text: string;
  sentimentLabel: SentimentLabel | null;
  confidence: number | null;
  productName: string;
  createdAt: string;
}

export interface DashboardData {
  productCount: number;
  stats: DashboardStats;
  trend: TrendPoint[];
  reviews: ReviewItem[];
}
