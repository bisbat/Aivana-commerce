import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductModule } from '../product/product.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/config/jwt-secret';
import { PayoutEntity } from 'src/payout/entities/payout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerEntity, UserEntity, PayoutEntity]),
    ProductModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule { }
