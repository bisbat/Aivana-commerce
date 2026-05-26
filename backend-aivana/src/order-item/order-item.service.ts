import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { COMMISSION_RATE } from 'src/common/instance';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,
    ) { }

    async createOrderItem(createOrderItemDto: CreateOrderItemDto): Promise<OrderItemEntity[]> {
        const { orderId, cartItems } = createOrderItemDto;
        const orderItems = await Promise.all(cartItems.map(async item => {
            const product = await this.productRepository.findOne({ where: { id: item.productId }, relations: ['seller'] });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return this.orderItemRepository.save({
                orderId: orderId,
                productId: item.productId,
                sellerId: product.seller.id,
                price: product.price,
                commissionRate: COMMISSION_RATE,
                commissionAmount: product.price * COMMISSION_RATE,
                sellerAmount: product.price - (product.price * COMMISSION_RATE),
            });
        }));

        return orderItems;
    }
}
