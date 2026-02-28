import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemService } from 'src/order-item/order-item.service';
import { OrderStatusEnum } from './enum/order-status.enum';
import { PaymentStatusEnum } from 'src/payment/enum/payment-status.enum';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { UserCollectionEntity } from 'src/user-collection/entities/user-collection.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserCollectionEntity)
    private readonly userCollectionRepository: Repository<UserCollectionEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    private readonly orderItemService: OrderItemService,
  ) {}

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
      createdAt: new Date(),
    });

    const orderItems = await this.orderItemService.createOrderItem({
      orderId: order.id,
      cartItems: cart.items,
    });
    order.totalAmount = orderItems
      .map((o) => Number(o.price))
      .reduce((a: number, b: number) => a + b, 0);
    await this.orderRepository.save(order);

    return order;
  }

  async getOrdersByUserId(userId: string) {
    return this.orderRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
      relations: ['items', 'items.product'],
    });
  }

  async getOrderById(orderId: number) {
    console.log('order id : ' + orderId);
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) {
      throw new NotFoundException('Not found order!');
    }
    return order;
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

  async markAsPaid(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.paymentRepository.findOne({
      where: { orderId: orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const cart = await this.cartRepository.findOne({
      where: { userId: order.userId },
    });

    if (cart) {
      const cartItems = await this.cartItemRepository.find({
        where: { cartId: cart.cartId },
      });

      for (const item of cartItems) {
        await this.cartItemRepository.remove(item);
      }

      await this.cartRepository.remove(cart);
    }

    if (payment.status === PaymentStatusEnum.SUCCESS) {
      return order;
    }

    if (order.status === OrderStatusEnum.PAID) {
      return order;
    }

    const orderItems = await this.orderItemRepository.find({
      where: { orderId: In([order.id]) },
    });

    console.log('Order Items:', orderItems);

    for (const item of orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (product) {
        const userCollection = this.userCollectionRepository.create({
          userId: order.userId,
          productId: product.id,
          orderItemId: item.id,
          createdAt: new Date(),
        });
        await this.userCollectionRepository.save(userCollection);
      }
    }

    order.status = OrderStatusEnum.PAID;
    order.paidAt = new Date();

    payment.status = PaymentStatusEnum.SUCCESS;
    payment.paidAt = new Date();
    payment.updatedAt = new Date();

    await this.paymentRepository.save(payment);
    return this.orderRepository.save(order);
  }

  async markAsFailed(orderId: number, reason?: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.paymentRepository.findOne({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // กัน webhook ยิงซ้ำ
    if (
      payment.status === PaymentStatusEnum.FAILED ||
      payment.status === PaymentStatusEnum.EXPIRED
    ) {
      return order;
    }

    const now = new Date();

    // แยกกรณีหมดอายุ vs failed
    if (reason === 'expired') {
      payment.status = PaymentStatusEnum.EXPIRED;
      payment.failureReason = 'QR expired';
      payment.expiredAt = now;
    } else {
      payment.status = PaymentStatusEnum.FAILED;
      payment.failureReason = reason ?? 'Payment failed';
      payment.failedAt = now;
    }

    payment.updatedAt = now;

    order.status = OrderStatusEnum.FAILED;
    order.updatedAt = now;

    await this.paymentRepository.save(payment);
    return this.orderRepository.save(order);
  }

  async markAsPaidCard(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.paymentRepository.findOne({
      where: { orderId: orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    console.log('payment', payment);

    const cart = await this.cartRepository.findOne({
      where: { userId: order.userId },
    });

    console.log('Cart:', cart);

    if (cart) {
      const cartItems = await this.cartItemRepository.find({
        where: { cartId: cart.cartId },
      });

      for (const item of cartItems) {
        await this.cartItemRepository.remove(item);
      }

      await this.cartRepository.remove(cart);
    }

    const orderItems = await this.orderItemRepository.find({
      where: { orderId: In([order.id]) },
    });

    console.log('Order Items:', orderItems);

    for (const item of orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (product) {
        const userCollection = this.userCollectionRepository.create({
          userId: order.userId,
          productId: product.id,
          orderItemId: item.id,
          createdAt: new Date(),
        });
        await this.userCollectionRepository.save(userCollection);
      }
    }

    order.status = OrderStatusEnum.PAID;
    order.paidAt = new Date();

    payment.status = PaymentStatusEnum.SUCCESS;
    payment.paidAt = new Date();
    payment.updatedAt = new Date();

    await this.paymentRepository.save(payment);
    return this.orderRepository.save(order);
  }

  async markAsFailedCard(orderId: number, reason?: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.paymentRepository.findOne({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const now = new Date();

    // แยกกรณีหมดอายุ vs failed
    if (reason === 'expired') {
      payment.status = PaymentStatusEnum.EXPIRED;
      payment.failureReason = 'QR expired';
      payment.expiredAt = now;
    } else {
      payment.status = PaymentStatusEnum.FAILED;
      payment.failureReason = reason ?? 'Payment failed';
      payment.failedAt = now;
    }

    payment.updatedAt = now;

    order.status = OrderStatusEnum.FAILED;
    order.updatedAt = now;

    await this.paymentRepository.save(payment);
    return this.orderRepository.save(order);
  }
}
