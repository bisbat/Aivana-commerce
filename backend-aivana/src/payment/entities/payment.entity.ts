import { PaymentMethodEnum } from "src/order/enum/payment.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatusEnum } from "../enum/payment-status.enum";

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

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  // ---- audit ----
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
