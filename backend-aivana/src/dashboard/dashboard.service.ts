import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { SellerEntity } from 'src/seller/entities/seller.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async getDashboardData(sellerId: string) {
    const [productCount, stats, trend, reviews] = await Promise.all([
      this.productRepository.count({
        where: { seller: { id: sellerId }, isDeleted: false },
      }),
      this.getStats(sellerId, 30),
      this.getTrend(sellerId, 4),
      this.getReviews(sellerId, undefined, 20),
    ]);

    return { productCount, stats, trend, reviews };
  }

  async getStats(sellerId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const row = await this.reviewRepository
      .createQueryBuilder('r')
      .innerJoin('r.product', 'p')
      .where('p.seller.id = :sellerId', { sellerId })
      .andWhere('p.isDeleted = false')
      .andWhere('r.createdAt >= :since', { since })
      .andWhere('r.sentimentLabel IS NOT NULL')
      .select([
        'COUNT(*) as total',
        "SUM(CASE WHEN r.sentimentLabel = 'pos' THEN 1 ELSE 0 END) as positive",
        "SUM(CASE WHEN r.sentimentLabel = 'neu' THEN 1 ELSE 0 END) as neutral",
        "SUM(CASE WHEN r.sentimentLabel = 'neg' THEN 1 ELSE 0 END) as negative",
        'AVG(r.confidence) as avg_confidence',
      ])
      .getRawOne();

    return {
      total: Number(row.total),
      positive: Number(row.positive),
      neutral: Number(row.neutral),
      negative: Number(row.negative),
      avg_confidence: Math.round(Number(row.avg_confidence) * 100) / 100,
      period_days: days,
    };
  }

  async getTrend(sellerId: string, weeks: number = 4) {
    const since = new Date();
    since.setDate(since.getDate() - weeks * 7);

    const rows = await this.reviewRepository
      .createQueryBuilder('r')
      .innerJoin('r.product', 'p')
      .where('p.seller.id = :sellerId', { sellerId })
      .andWhere('p.isDeleted = false')
      .andWhere('r.createdAt >= :since', { since })
      .andWhere('r.sentimentLabel IS NOT NULL')
      .select([
        "DATE_TRUNC('week', r.createdAt) as week",
        "SUM(CASE WHEN r.sentimentLabel = 'pos' THEN 1 ELSE 0 END) as positive",
        "SUM(CASE WHEN r.sentimentLabel = 'neg' THEN 1 ELSE 0 END) as negative",
        "SUM(CASE WHEN r.sentimentLabel = 'neu' THEN 1 ELSE 0 END) as neutral",
      ])
      .groupBy("DATE_TRUNC('week', r.createdAt)")
      .orderBy("DATE_TRUNC('week', r.createdAt)", 'ASC')
      .getRawMany();

    return rows.map((r, i) => ({
      week: `สัปดาห์ ${i + 1}`,
      positive: Number(r.positive),
      negative: Number(r.negative),
      neutral: Number(r.neutral),
    }));
  }

  async getReviews(
    sellerId: string,
    sentiment?: 'pos' | 'neu' | 'neg',
    limit: number = 20,
  ) {
    const query = this.reviewRepository
      .createQueryBuilder('r')
      .innerJoin('r.product', 'p')
      .where('p.seller.id = :sellerId', { sellerId })
      .andWhere('p.isDeleted = false')
      .andWhere('r.sentimentLabel IS NOT NULL')
      .select([
        'r.id as id',
        'r.comment as text',      
        'r.sentimentLabel as sentimentLabel',
        'r.confidence as confidence',
        'r.createdAt as createdAt',
        'p.name as productName',
      ])
      .orderBy('r.createdAt', 'DESC')
      .limit(limit);

    if (sentiment) {
      query.andWhere('r.sentimentLabel = :sentiment', { sentiment });
    }

    return query.getRawMany();
  }
}