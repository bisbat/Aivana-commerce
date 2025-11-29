import { Expose, Type } from 'class-transformer';
import { CartItemProductDto } from './cart-item-product.dto';

export class CartItemDto {
  @Expose()
  cartItemId: number;

  @Expose()
  cartId: number;

  @Expose()
  productId: number;

  @Expose()
  @Type(() => CartItemProductDto)
  product: CartItemProductDto;

  @Expose()
  createdAt: Date;
}
