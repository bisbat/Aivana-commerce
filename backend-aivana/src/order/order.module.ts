import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderItemModule } from 'src/order-item/order-item.module';
import { PaymentEntity } from 'src/payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, Cart, OrderItemEntity, PaymentEntity]), OrderItemModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService], 
})
export class OrderModule {}
