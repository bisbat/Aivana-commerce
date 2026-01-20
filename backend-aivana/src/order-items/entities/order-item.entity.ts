import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { SellerEntity } from 'src/sellers/entities/seller.entity';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  sellerId: number;

  @Column('decimal')
  price: number;

  @Column('decimal')
  commissionRate: number;

  @Column('decimal')
  commissionAmount: number;

  @Column('decimal')
  sellerAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => SellerEntity, (seller) => seller.orderItems)
  @JoinColumn({ name: 'sellerId' })
  seller: SellerEntity;
}
