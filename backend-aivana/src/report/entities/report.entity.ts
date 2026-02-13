import { ReportStatus } from 'src/constants/report-status.enum';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity('report')
@Unique(['orderItem']) // 1 orderItem = 1 report
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  // User 1 คน report ได้หลายครั้ง (หลาย order)
  @ManyToOne(() => UserEntity, (user) => user.reports, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reportedById' })
  reportedBy: UserEntity;

  // OrderItem 1 ชิ้น = report ได้ครั้งเดียว
  @OneToOne(() => OrderItemEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItemEntity;

  @Column({ type: 'varchar', length: 100 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  // Seller Response (เก็บเฉพาะเวลาที่ตอบกลับ)
  @Column({ type: 'timestamp', nullable: true })
  sellerRespondedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
