import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { OrderEntity } from '../../order/entities/order.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { SellerEntity } from 'src/seller/entities/seller.entity';
import { PayoutItemEntity } from 'src/payout-item/entities/payout-item.entity';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  sellerId: string;

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

  @OneToOne(() => PayoutItemEntity, (payoutItem) => payoutItem.orderItem)
  payoutItem: PayoutItemEntity;
}
