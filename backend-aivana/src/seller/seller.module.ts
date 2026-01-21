import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerEntity, UserEntity]),
    ProductModule,
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
