import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SellerEntity } from 'src/seller/entities/seller.entity';
import { PayoutStatus } from 'src/constants/payout.enum';
import { PayoutItemEntity } from 'src/payout-item/entities/payout-item.entity';

@Entity('payout')
export class PayoutEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => SellerEntity, (seller) => seller.payouts, {
    nullable: false,
  })
  @JoinColumn({ name: 'sellerId' })
  seller: SellerEntity;

  @Column({ type: 'timestamp' })
  periodStart: Date;

  @Column({ type: 'timestamp' })
  periodEnd: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
  status: PayoutStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => PayoutItemEntity, (payoutItem) => payoutItem.payout)
  payoutItem: PayoutItemEntity[];
}
