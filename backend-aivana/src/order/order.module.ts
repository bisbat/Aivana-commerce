import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderItemService } from 'src/order-item/order-item.service';
import { OrderItemModule } from 'src/order-item/order-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, Cart, OrderItemEntity]), OrderItemModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
