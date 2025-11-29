import { IsString, IsOptional, IsArray, IsNumber, IsUrl, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

class SocialsDto {
    @IsOptional()
    @IsUrl()
    instagram?: string;

    @IsOptional()
    @IsUrl()
    facebook?: string;

    @IsOptional()
    @IsUrl()
    tiktok?: string;

    @IsOptional()
    @IsUrl()
    github?: string;

    @IsOptional()
    @IsUrl()
    linkedin?: string;
}

class BankInfoDto {
    @IsString()
    bankName: string;

    @IsString()
    accountNumber: string;

    @IsString()
    accountName: string;
}

export class CreateSellerDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => UserEntity)
    user?: UserEntity;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];

    @IsOptional()
    @IsNumber()
    totalProducts?: number;

    @IsOptional()
    @IsNumber()
    totalSales?: number;

    @IsOptional()
    @IsNumber()
    averageRating?: number;

    @IsOptional()
    @IsNumber()
    totalReviews?: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => SocialsDto)
    socials?: SocialsDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => BankInfoDto)
    bankInfo?: BankInfoDto;
}
