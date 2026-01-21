import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PayoutEntity } from 'src/payout/entities/payout.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';

@Entity('payout_item')
export class PayoutItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PayoutEntity, (payout) => payout.payoutItem, {
    nullable: false,
  })
  @JoinColumn({ name: 'payoutId' })
  payout: PayoutEntity;

  @OneToOne(() => OrderItemEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItemEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
