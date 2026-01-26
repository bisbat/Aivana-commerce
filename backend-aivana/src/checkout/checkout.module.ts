import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { ProductEntity } from 'src/product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
