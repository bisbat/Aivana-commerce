import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewsModule {}
