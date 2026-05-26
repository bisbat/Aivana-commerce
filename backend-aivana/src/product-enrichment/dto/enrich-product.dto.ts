import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import type { ExtractedMetadata } from 'src/shared/types/extracted-metadata.types';

export class EnrichProductDto {
  @IsObject()
  metadata: ExtractedMetadata;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'Product keyword is required' })
  sellerKeywords: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableTags?: string[];

  @IsArray()
  @IsOptional()
  availableCategories?: { id: number; name: string }[];
}
