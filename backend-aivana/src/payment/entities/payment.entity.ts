import { PaymentStatusEnum } from "src/order/enum/order-status.enum";
import { PaymentMethodEnum } from "src/order/enum/payment.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ---- relation ----
  @Column()
  orderId: number;

  // ---- provider ----
  @Column({ default: 'omise' })
  provider: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
  })
  paymentMethod: PaymentMethodEnum;

  // ---- money ----
  @Column({ type: 'int' }) // สตางค์
  amount: number;

  @Column({ default: 'THB' })
  currency: string;

  // ---- omise ----
  @Column({ nullable: true })
  chargeId: string;

  @Column({ nullable: true })
  sourceId: string;

  @Column({ nullable: true })
  qrImageUrl: string;

  // ---- status ----
  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  // ---- audit ----
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
