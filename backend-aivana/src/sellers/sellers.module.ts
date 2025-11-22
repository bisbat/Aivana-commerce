import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
