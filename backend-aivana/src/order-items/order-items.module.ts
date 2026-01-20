import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { OrderItemEntity } from './entities/order-item.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { OrderEntity } from 'src/order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemEntity, OrderEntity, ProductEntity]),
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
})
export class OrderItemsModule {}
