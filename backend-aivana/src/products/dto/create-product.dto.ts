import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  uploaded_file_path?: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  blurb: string;

  @IsString()
  installation_guide: string;

  @IsString()
  @IsOptional()
  preview_url?: string;

  @IsString()
  @IsOptional()
  hero_image_url?: string;

  @Transform(({ value }) => JSON.parse(value as string) as string[])
  @IsArray()
  @IsString({ each: true })
  features: Array<string>;

  @Transform(({ value }) => JSON.parse(value as string) as string[])
  @IsArray()
  @IsString({ each: true })
  compatibility: Array<string>;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  categoryId: number;
  
  @IsNotEmpty()
  @IsString()
  sellerId: string;

  @Transform(({ value }) =>
    value ? (JSON.parse(value as string) as number[]) : undefined,
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tagIds?: number[];
}
