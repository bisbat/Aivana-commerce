import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemService } from 'src/order-item/order-item.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,

        private readonly orderItemService: OrderItemService,
    ) { }

    async createOrder(userId: string, createOrderDto: CreateOrderDto) {
        const cart = await this.cartRepository.findOne({
            where: { userId: userId },
            relations: ['items'],
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (cart?.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const order = await this.orderRepository.save({
            userId,
            totalAmount: 0,
            paymentMethod: createOrderDto.paymentMethod,
        });

        const orderItems = await this.orderItemService.createOrderItem({ orderId: order.id, cartItems: cart.items });
        order.totalAmount = orderItems.map((o) => Number(o.price)).reduce((a: number, b: number) => a + b, 0);
        await this.orderRepository.save(order);

        return order;
    }

    async getOrdersByUserId(userId: string) {
        return this.orderRepository.find({
            where: { userId: userId },
            relations: ['items'],
        });
    }

    async getOrderById(orderId: number){
        console.log('order id : '+ orderId)
        const order = await this.orderRepository.findOne({
            where:{id: orderId},
            relations: ['items', 'items.product']
        })
        if(!order){
            throw new NotFoundException('Not found order!')
        }

        // if (order.status !== 'pending') {
        // throw new BadRequestException('Order is not payable');
        // }

        return order
    }

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
