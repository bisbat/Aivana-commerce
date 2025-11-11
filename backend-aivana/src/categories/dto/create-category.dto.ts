import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
