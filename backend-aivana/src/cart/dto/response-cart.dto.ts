import { Expose, Type } from 'class-transformer';
import { CartItemProductDto } from './cart-item-product.dto';

export class CartResponseDto {
  @Expose()
  message: string;

  @Expose()
  cartId: number;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => CartItemProductDto)
  items: CartItemProductDto[];

  @Expose()
  totalItems: number;
}
