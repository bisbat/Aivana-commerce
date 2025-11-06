import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  uploaded_file_path: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  blurb: string;

  @IsString()
  installation_guide: string;

  @IsString()
  preview_url: string;

  @IsString()
  hero_image_url: string;

  @IsArray()
  @IsString({ each: true })
  features: Array<string>;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  ownerId: number;
}
