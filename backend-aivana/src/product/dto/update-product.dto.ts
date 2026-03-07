import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  blurb?: string;

  @IsOptional()
  @IsString()
  installationGuide?: string;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value as string) as string[])
  @IsArray()
  features?: string[];

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value as string) as string[])
  @IsArray()
  compatibility?: string[];

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value as string) as string[])
  @IsArray()
  requirement: Array<string>;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value as string) as string[])
  @IsArray()
  techstack: Array<string>;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  sellerId?: number;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value as string) as number[])
  @IsArray()
  tagIds?: number[];

  @IsOptional()
  @IsString()
  previewUrl?: string;

  @IsOptional()
  @IsString()
  apiDocUrl?: string;
}
