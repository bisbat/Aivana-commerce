import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { MetadataExtractionService } from './metadata-extraction.service';
import { ProductService } from './product.service';
import { ExtractedMetadata } from './interfaces/metadata.interface';

/**
 * Handles metadata extraction for uploaded product ZIP files.
 * Kept separate from ProductController — single responsibility.
 *
 * Base route: POST /metadata/extract/:productId
 */
@Controller('metadata')
export class MetadataExtractionController {
  constructor(
    private readonly metadataExtractionService: MetadataExtractionService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Manually re-trigger metadata extraction for an existing product.
   * Useful for: re-processing after ZIP update, or admin tooling.
   *
   * Only SELLER and ADMIN can call this.
   */
  @Post('extract/:productId')
  @Roles(Role.SELLER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async extractMetadata(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<{ message: string; metadata: ExtractedMetadata }> {
    // 1. Load product — we need uploadedFilePath + category
    const product = await this.productService.getProductById(productId, {
      includeHidden: true,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (!product.uploadedFilePath) {
      throw new NotFoundException(
        `Product ${productId} has no uploaded ZIP file yet`,
      );
    }

    if (!product.category?.name) {
      throw new NotFoundException(
        `Product ${productId} has no category assigned`,
      );
    }

    // 2. Map category name → extraction category slug
    //    CategoryEntity.name must match one of these values
    const category = this.resolveCategory(product.category.name);

    // 3. Run extraction — service handles download, extract, scan, cleanup
    const metadata = await this.metadataExtractionService.extractMetadataFromUrl(
      category,
      product.uploadedFilePath, // MinIO URL
    );

    return {
      message: 'Metadata extracted successfully',
      metadata,
    };
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Maps human-readable category names stored in DB
   * to the strict union type the extraction service expects.
   */
  private resolveCategory(
    categoryName: string,
  ): 'ui-kit' | 'frontend-template' | 'backend-template' {
    const normalized = categoryName.toLowerCase().trim();

    if (normalized.includes('ui') || normalized.includes('kit')) {
      return 'ui-kit';
    }
    if (normalized.includes('frontend') || normalized.includes('front-end')) {
      return 'frontend-template';
    }
    if (normalized.includes('backend') || normalized.includes('back-end')) {
      return 'backend-template';
    }

    // Safe fallback — we never crash, we just label it as frontend
    return 'frontend-template';
  }
}