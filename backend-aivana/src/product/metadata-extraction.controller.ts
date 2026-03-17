import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MetadataExtractionService } from './metadata-extraction.service';
import { ExtractedMetadata } from '../shared/types/extracted-metadata.types';

type Category = 'ui-kit' | 'frontend-template' | 'backend-template';

@Controller('metadata-extraction')
export class MetadataExtractionController {
  constructor(private readonly metadataService: MetadataExtractionService) {}

  /**
   * Upload ZIP and extract metadata
   *
   * Postman:
   * form-data
   * - category: frontend-template
   * - file: (zip)
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async extractFromUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: Category,
  ): Promise<ExtractedMetadata> {
    if (!file) {
      throw new BadRequestException('Product file is required');
    }

    if (!category) {
      throw new BadRequestException('Product category is required');
    }
    return this.metadataService.extractMetadataFromBuffer(
      category,
      file.buffer,
    );
  }
  /**
   * Extract metadata from file URL
   *
   * Postman:
   * JSON body
   * {
   *   "category": "frontend-template",
   *   "fileUrl": "https://..."
   * }
   */
  @Post('url')
  async extractFromUrl(
    @Body('category') category: Category,
    @Body('fileUrl') fileUrl: string,
  ): Promise<ExtractedMetadata> {
    return this.metadataService.extractMetadataFromUrl(category, fileUrl);
  }
}
