import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  uploaded_file_path: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  blurb: string;

  @Column({ type: 'text' })
  installation_guide: string;

  @Column({ type: 'text' })
  preview_url: string;

  @Column({ type: 'text', nullable: true })
  hero_image_url: string;

  @Column({ type: 'text', array: true })
  features: Array<string>;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.owned_products, {
    nullable: false,
  })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;
}
