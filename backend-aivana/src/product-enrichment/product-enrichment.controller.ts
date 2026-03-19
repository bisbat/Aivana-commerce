import { ProductEnrichmentService } from './product-enrichment.service';
import { Get, Post, Body, Controller, UseGuards } from '@nestjs/common';
import { EnrichProductDto } from './dto/enrich-product.dto';
import { AiGeneratedProduct } from './dto/ai-generated-product.types';
import { PassportJwtAuthGuard } from '../auth/guards/passport-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enum/role.enum';

@Controller('product-enrichment')
@UseGuards(PassportJwtAuthGuard, RolesGuard)
export class ProductEnrichmentController {
  constructor(private enrichmentService: ProductEnrichmentService) {}

  @Post('enrich')
  @Roles(Role.SELLER, Role.ADMIN)
  async enrich(@Body() dto: EnrichProductDto): Promise<AiGeneratedProduct> {
    return this.enrichmentService.enrich(dto);
  }
}
