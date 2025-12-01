import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { SellerEntity } from 'src/sellers/entities/seller.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  uploadedFilePath: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  blurb: string;

  @Column({ type: 'text' })
  installationGuide: string;

  @Column({ type: 'text', nullable: true })
  previewUrl: string;

  @Column({ type: 'text', nullable: true })
  heroImageUrl: string;

  @Column({ type: 'text', array: true })
  features: Array<string>;

  @Column({ type: 'text', array: true, nullable: true })
  compatibility: Array<string>;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  // Owner should be a User with SELLER role or specific SellerEntity
  @ManyToOne(() => SellerEntity, (seller) => seller.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'sellerId' })
  seller: SellerEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => ProductImage, (image) => image.product)
  productImages: ProductImage[];

  // Tags relationship
  @ManyToMany(() => TagEntity, (tag) => tag.products, { cascade: true })
  @JoinTable()
  tags: TagEntity[];
}
