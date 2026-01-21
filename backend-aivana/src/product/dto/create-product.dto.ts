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
  uploadedFilePath?: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  blurb: string;

  @IsString()
  installationGuide: string;

  @IsString()
  @IsOptional()
  previewUrl?: string;

  @IsString()
  @IsOptional()
  heroImageUrl?: string;
  
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
