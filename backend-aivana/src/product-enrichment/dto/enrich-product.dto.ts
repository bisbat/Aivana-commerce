import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import type { ExtractedMetadata } from 'src/shared/types/extracted-metadata.types';

export class EnrichProductDto {
  @IsObject()
  metadata: ExtractedMetadata;

  @IsArray()
  @IsString({ each: true })
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
