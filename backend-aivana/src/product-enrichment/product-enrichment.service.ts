import { Injectable } from '@nestjs/common';
import { EnrichProductDto } from './dto/enrich-product.dto';
import { PromptBuilderService } from './prompt-builder/prompt-builder.service';
import { GeminiService } from 'src/ai/gemini.service';
import type { AiGeneratedProduct } from './dto/ai-generated-product.types';
import type { EnrichmentContext } from './types/enrichment-context.types';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductEnrichmentService {
  constructor(
    private readonly promptBuilder: PromptBuilderService,
    private readonly gemini: GeminiService,
  ) {}

  async enrich(dto: EnrichProductDto): Promise<AiGeneratedProduct> {
    const context = this.mergeContext(dto);
    const prompt = this.promptBuilder.build(context);
    const rawResponse = await this.gemini.generate(prompt);
    const parsed = this.parseAndValidate(rawResponse);

    return parsed;
  }

  private mergeContext(dto: EnrichProductDto): EnrichmentContext {
    return {
      metadata: dto.metadata,
      sellerKeywords: dto.sellerKeywords,
      category: dto.metadata.category,
    };
  }

  private parseAndValidate(raw: string): AiGeneratedProduct {
    let parsed: AiGeneratedProduct;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new BadRequestException('AI returned invalid JSON');
    }

    const requiredFields: (keyof AiGeneratedProduct)[] = [
      'productName',
      'blurb',
      'description',
      'features',
      'techStack',
      'compatibility',
      'requirements',
      'tags',
    ];

    for (const field of requiredFields) {
      if (!parsed[field]) {
        throw new BadRequestException(`AI response missing field: ${field}`);
      }
    }

    return parsed;
  }
}
