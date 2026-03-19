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

  /** Tag names available in the marketplace — AI must pick from this list */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableTags?: string[];

  /** Categories available in the marketplace — AI must pick exactly one */
  @IsArray()
  @IsOptional()
  availableCategories?: { id: number; name: string }[];
}
