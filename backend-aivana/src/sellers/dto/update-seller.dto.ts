import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';
import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { updateUserDto } from 'src/users/dto/update-user.dto';

export class UpdateSellerDto {
    @IsOptional()
    user: updateUserDto;
    @IsOptional()
    @IsString()
    bio?: string;
    @IsOptional()
    @IsString()
    location?: string;
    @IsOptional()
    @IsArray()
    skills?: string[];
    @IsOptional()
    @IsArray()
    tools?: string[];
    @IsOptional()
    @IsObject()
    socialLinks?: Record<string, string>;
    @IsOptional()
    @IsString()
    bankName?: string;
    @IsOptional()
    @IsString()
    bankAccountNumber?: string;
    @IsOptional()
    @IsString()
    bankAccountName?: string;
}
