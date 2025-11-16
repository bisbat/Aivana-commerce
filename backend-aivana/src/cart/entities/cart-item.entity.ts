import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'cart_item_id' })
  cartItemId: number;

  @Column({ name: 'cart_id', type: 'bigint' })
  cartId: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Cart, (cart: Cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => ProductEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
