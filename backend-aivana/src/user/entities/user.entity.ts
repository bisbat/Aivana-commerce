import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from 'src/auth/enum/role.enum';
import { SellerEntity } from 'src/seller/entities/seller.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { ReportEntity } from 'src/report/entities/report.entity';
import { ReviewEntity } from '../../review/entities/review.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @OneToOne(() => SellerEntity, (seller) => seller.user)
  sellerProfile: SellerEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToOne(() => ReportEntity, (report) => report.reportedBy)
  reports: ReportEntity;

  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];
}
