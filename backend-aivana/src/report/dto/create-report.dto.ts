import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  orderItemId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reason: string;

  @IsString()
  @IsOptional()
  message?: string;
}
