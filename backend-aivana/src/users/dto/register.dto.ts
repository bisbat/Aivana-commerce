import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from '../../constants/user-roles.enum';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string
  @IsNotEmpty()
  username: string
  @IsNotEmpty()
  firstName: string
  @IsNotEmpty()
  lastName: string
  @IsOptional()
  avatarUrl?: string
}
