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
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'imageId' })
  imageId: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pathImage' })
  pathImage: string;

  @ManyToOne(() => ProductEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
