import { IsArray, IsNumber } from "class-validator";
import { CartItem } from "src/cart/entities/cart-item.entity";

export class CreateOrderItemDto {
    @IsNumber()
    orderId: number;
    @IsArray()
    @IsArray({ each: true })
    cartItems: CartItem[];
}   