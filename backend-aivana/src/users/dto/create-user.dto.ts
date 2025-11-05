import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { UserRoles } from "../../utility/common/user-roles.enum";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
    
    @IsOptional()
    first_name?: string;

    @IsOptional()
    last_name?: string;

    @IsOptional()
    promptpay_id?: string;

    @IsEnum(UserRoles, { message: 'Role must be admin, seller, or customer' })
    @IsOptional()
    role?: UserRoles;
}
