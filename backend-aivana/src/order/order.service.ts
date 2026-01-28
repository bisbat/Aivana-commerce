// ===== order.service.ts =====
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async hasUserPurchasedProduct(
    userId: string,
    productId: number,
  ): Promise<boolean> {
    return this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'orderItem')
      .where('order.userId = :userId', { userId })
      .andWhere('orderItem.productId = :productId', { productId })
      .andWhere('order.status = :status', { status: 'PAID' })
      .getExists();
  }
}
