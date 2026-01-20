import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { OrderItemEntity } from 'src/order-items/entities/order-item.entity';

@Entity('sellers')
export class SellerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.sellerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  storeName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'int', default: 0 })
  totalSales: number;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'text', array: true, default: [] })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true })
  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    github?: string;
    linkedin?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  @OneToMany(() => ProductEntity, (product) => product.seller)
  products: ProductEntity[];

  @OneToMany(() => OrderItemEntity, (item) => item.seller)
  orderItems: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
