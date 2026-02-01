// user-collection.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCollectionEntity } from './entities/user-collection.entity';
import { ReviewService } from 'src/review/review.service';
import { ReportService } from 'src/report/report.service';

// ===== user-collection.service.ts =====
@Injectable()
export class UserCollectionService {
  constructor(
    @InjectRepository(UserCollectionEntity)
    private userCollectionRepository: Repository<UserCollectionEntity>,
    private reviewService: ReviewService,
    private reportService: ReportService,
  ) {}

  async findByUserId(userId: string) {
    const collections = await this.userCollectionRepository.find({
      where: { userId },
      relations: ['product', 'orderItem'],
    });

    const collectionsWithReview = await Promise.all(
      collections.map(async (collection) => {
        const hasReviewed = await this.reviewService.hasUserReviewedProduct(
          userId,
          collection.product.id,
        );

        const hasReported = await this.reportService.findByOrderItem(
          collection.orderItem.id,
        );

        return {
          ...collection,
          product: {
            ...collection.product,
            hasReviewed: !!hasReviewed,
            hasReported: !!hasReported,
          },
        };
      }),
    );
    return collectionsWithReview;
  }
}
