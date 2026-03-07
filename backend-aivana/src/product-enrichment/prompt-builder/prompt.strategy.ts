import { EnrichmentContext } from '../types/enrichment-context.types';

export interface PromptStrategy {
  buildPrompt(context: EnrichmentContext): string;
}
