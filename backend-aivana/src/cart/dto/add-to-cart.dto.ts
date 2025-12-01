import { IsString, IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsString()
  userId: string;

  @IsNumber()
  productId: number;
}
