import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  // ✅ เพิ่ม productId column
  @Column({ type: 'bigint' })
  productId: number;

  // ✅ เพิ่ม buyerId column
  @Column({ type: 'varchar' })
  buyerId: string;

  @ManyToOne(() => ProductEntity, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'buyerId' })
  buyer: UserEntity;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'int', default: 0 })
  likeCounted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
