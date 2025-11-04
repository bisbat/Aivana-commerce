import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsPositive, Min, Max, ArrayMinSize } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  installation_doc?: string;

  @IsString()
  @IsOptional()
  blurb?: string;

  @IsString()
  @IsOptional()
  preview_url?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' })
  @IsPositive({ message: 'Price must be positive' })
  @Min(0.01, { message: 'Price must be at least 0.01' })
  @Max(999999.99, { message: 'Price cannot exceed 999,999.99' })
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Each feature must be a string' })
  @ArrayMinSize(0, { message: 'Features array cannot be empty if provided' })
  features?: string[];

  @IsNumber({}, { message: 'Category ID must be a number' })
  @IsNotEmpty({ message: 'Category ID is required' })
  category_id: number;

  @IsNumber({}, { message: 'Seller ID must be a number' })
  @IsNotEmpty({ message: 'Seller ID is required' })
  seller_id: number;

  @IsString()
  @IsOptional()
  file_path?: string;

  @IsString()
  @IsOptional()
  hero_image?: string;
}
