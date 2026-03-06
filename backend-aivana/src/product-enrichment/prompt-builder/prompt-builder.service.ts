import { Injectable } from '@nestjs/common';
import { EnrichmentContext } from '../types/enrichment-context.types';
import { PromptStrategy } from './prompt.strategy';
import { UIKitStrategy } from './strategies/ui-kit.strategy';
import { FrontendTemplateStrategy } from './strategies/frontend-template.strategy';
import { BackendTemplateStrategy } from './strategies/backend-template.strategy';

@Injectable()
export class PromptBuilderService {
  // Strategy map
  private readonly strategies: Record<string, PromptStrategy> = {
    'ui-kit': new UIKitStrategy(),
    'frontend-template': new FrontendTemplateStrategy(),
    'backend-template': new BackendTemplateStrategy(),
  };

  build(context: EnrichmentContext): string {
    const strategy = this.strategies[context.category];
    return strategy.buildPrompt(context);
  }
}
