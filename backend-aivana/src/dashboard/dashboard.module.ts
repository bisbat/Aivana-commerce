import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProductEntity } from 'src/product/entities/product.entity';
import { SellerEntity } from 'src/seller/entities/seller.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, SellerEntity, ReviewEntity]), 
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}