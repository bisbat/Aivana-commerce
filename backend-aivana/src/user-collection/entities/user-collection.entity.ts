import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { OrderItemEntity } from 'src/order-items/entities/order-item.entity';
@Entity('user_collection')
export class UserCollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column()
  orderItemId: number;

  @CreateDateColumn()
  createdAt: Date;

  // relations (มีเพื่อความสะดวกในการ join ข้อมูล)
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => OrderItemEntity)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItemEntity;
}
