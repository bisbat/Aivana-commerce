import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { OrderService } from 'src/order/order.service';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    private readonly orderService: OrderService,
  ) {}

  async create(
    currentUserId: string,
    productId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    // 1. เช็คว่าคนที่ login นี้ซื้อสินค้าแล้วหรือยัง
    const hasPurchased = await this.orderService.hasUserPurchasedProduct(
      currentUserId,
      productId,
    );

    if (!hasPurchased) {
      throw new ForbiddenException(
        'You can only review products you have purchased.',
      );
    }

    //  2. เช็คว่ารีวิวไปแล้วหรือยัง
    const hasReviewed = await this.hasUserReviewedProduct(
      currentUserId,
      productId,
    );

    if (hasReviewed) {
      throw new ConflictException('You have already reviewed this product.');
    }

    // 3. สร้าง review (ใช้ currentUserId เป็น buyerId)
    const review = this.reviewRepository.create({
      productId,
      buyerId: currentUserId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      likeCounted: 0,
    });

    return await this.reviewRepository.save(review);
  }

  async hasUserReviewedProduct(
    buyerId: string,
    productId: number,
  ): Promise<boolean> {
    return await this.reviewRepository.exists({
      where: { productId, buyerId },
    });
  }

  async findByUser(buyerId: string): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      where: { buyerId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }
}
