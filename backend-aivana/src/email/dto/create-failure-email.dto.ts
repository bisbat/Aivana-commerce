import { IsEmail, IsString } from "class-validator";

export class CreateEmailFailureDto {
    @IsEmail()
    @IsString()
    customerEmail: string;
    @IsString()
    customerName: string;
    @IsString()
    orderId: string;
}