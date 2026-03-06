import { Module } from '@nestjs/common';
import { ProductEnrichmentService } from './product-enrichment.service';
import { ProductEnrichmentController } from './product-enrichment.controller';
import { PromptBuilderService } from './prompt-builder/prompt-builder.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [ProductEnrichmentService, PromptBuilderService],
  controllers: [ProductEnrichmentController],
})
export class ProductEnrichmentModule {}
