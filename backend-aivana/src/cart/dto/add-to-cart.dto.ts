import { IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  productId: number;
}
