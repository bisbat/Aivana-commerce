import type { ExtractedMetadata } from '../../shared/types/extracted-metadata.types';

export interface EnrichmentContext {
  metadata: ExtractedMetadata;
  sellerKeywords: string[];
  category: ExtractedMetadata['category'];
  availableTags?: string[];
  availableCategories?: { id: number; name: string }[];
}
