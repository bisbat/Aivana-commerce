import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  buyer: UserEntity;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 1000 })
  comment: string;

  @Column({ type: 'int', default: 0 })
  likeCounted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
