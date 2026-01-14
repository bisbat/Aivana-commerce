import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerEntity, UserEntity]),
    ProductsModule,
  ],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
