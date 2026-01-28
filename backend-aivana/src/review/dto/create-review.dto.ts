import {
  IsInt,
  IsString,
  Min,
  Max,
  IsOptional,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt({ message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be greater than or equal to 1' })
  @Max(5, { message: 'Rating must be less than or equal to 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;

  @IsString({ message: 'Comment must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  comment?: string;
}
