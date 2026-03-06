import { ProductEnrichmentService } from './product-enrichment.service';
import { Get, Post, Body, Controller } from '@nestjs/common';
import { EnrichProductDto } from './dto/enrich-product.dto';
import { AiGeneratedProduct } from './dto/ai-generated-product.types';

@Controller('product-enrichment')
export class ProductEnrichmentController {
  constructor(private enrichmentService: ProductEnrichmentService) {}

  @Post('enrich')
  async enrich(@Body() dto: EnrichProductDto): Promise<AiGeneratedProduct> {
    return this.enrichmentService.enrich(dto);
  }
}
