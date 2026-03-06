import { IsArray, IsObject, IsString } from 'class-validator';
import type { ExtractedMetadata } from 'src/shared/types/extracted-metadata.types';

export class EnrichProductDto {
  @IsObject()
  metadata: ExtractedMetadata;

  @IsArray()
  @IsString({ each: true })
  sellerKeywords: string[];
}
