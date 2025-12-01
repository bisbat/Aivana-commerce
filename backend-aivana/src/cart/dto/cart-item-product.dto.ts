import { Expose, Type } from 'class-transformer';
import { MinimalSellerDto } from 'src/sellers/dto/minimal-seller.dto';

export class CartItemProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  heroImageUrl: string;

  @Expose()
  @Type(() => MinimalSellerDto)
  seller: MinimalSellerDto | null;
}
