import {IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethodEnum } from '../enum/payment.enum';
export class CreateOrderDto {
    @IsEnum(PaymentMethodEnum)
    paymentMethod: PaymentMethodEnum;
}