// user-collection.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCollectionEntity } from './entities/user-collection.entity';
import { ReviewService } from 'src/review/review.service';

// ===== user-collection.service.ts =====
@Injectable()
export class UserCollectionService {
  constructor(
    @InjectRepository(UserCollectionEntity)
    private userCollectionRepository: Repository<UserCollectionEntity>,
    private reviewService: ReviewService,
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

        return {
          ...collection,
          product: {
            ...collection.product,
            hasReviewed,
          },
        };
      }),
    );
    return collectionsWithReview;
  }
}
