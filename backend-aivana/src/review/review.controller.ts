import { Controller, Param, Post, Req, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
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
