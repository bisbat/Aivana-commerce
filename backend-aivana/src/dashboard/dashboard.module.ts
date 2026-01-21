import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { SellerEntity } from 'src/seller/entities/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, SellerEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
