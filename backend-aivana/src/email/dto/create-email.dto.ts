import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";
import { OrderItemEntity } from "src/order-item/entities/order-item.entity";

export class CreateEmailSuccessDto {
    @IsString()
    @IsEmail()
    customerEmail: string;
    @IsString()
    customerName: string;
    @IsString()
    orderId: string;
    items: OrderItemEntity[];
    @IsNumber()
    amount: number;
    paymentMethod: string;
    @IsDate()
    paidAt: Date;
}
