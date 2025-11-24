import { IsNotEmpty, IsString, IsOptional, IsArray } from "class-validator";

export class CreateSellerDto {
    @IsOptional()
    @IsString()
    bio?: string;
    
    @IsOptional()
    @IsString()
    location?: string;
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tools?: string[];
    
    @IsOptional()
    socialLinks?: Record<string, string>;
    
    // Required bank information
    @IsNotEmpty()
    @IsString()
    bankName: string;
    
    @IsNotEmpty()
    @IsString()
    bankAccountNumber: string;
    
    @IsNotEmpty()
    @IsString()
    bankAccountName: string;
}
