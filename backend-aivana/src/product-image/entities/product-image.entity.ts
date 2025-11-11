import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('product_image')
export class ProductImage {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'image_id' })
  image_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'path_image' })
  path_image: string;

  @ManyToOne(() => ProductEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
