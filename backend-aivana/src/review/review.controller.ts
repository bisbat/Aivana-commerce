import { Controller, Param, Post, Req, Body, Get } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/my-reviews')
  async getMyReviews(@Req() req) {
    const currentUserId = req.user.userId;
    return this.reviewService.findByUser(currentUserId);
  }

  @Post('/product/:productId')
  async createReview(
    @Param('productId') productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    const currentUserId = req.user.userId;
    return this.reviewService.create(currentUserId, productId, createReviewDto);
  }
}
