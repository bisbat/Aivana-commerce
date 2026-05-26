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

  @Column({ type: 'bigint' })
  productId: number;

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

  @Column({ type: 'varchar', length: 3, nullable: true })
  sentimentLabel: 'pos' | 'neu' | 'neg' | null;

  @Column({ type: 'float', nullable: true })
  confidence: number | null;

  @Column({ type: 'float', nullable: true })
  posScore: number | null;

  @Column({ type: 'float', nullable: true })
  neuScore: number | null;

  @Column({ type: 'float', nullable: true })
  negScore: number | null;

  @Column({ type: 'timestamp', nullable: true })
  analyzedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}