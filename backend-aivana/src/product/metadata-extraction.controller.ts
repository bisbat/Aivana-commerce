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
import { ExtractionResult } from '../shared/types/extracted-metadata.types';

type Category = 'ui-kit' | 'frontend-template' | 'backend-template';

// ZIP magic bytes — 4 bytes แรกต้องเป็น PK\x03\x04 เสมอ
function isZipBuffer(buffer: Buffer): boolean {
  return (
    buffer.length > 4 &&
    buffer[0] === 0x50 && // P
    buffer[1] === 0x4b && // K
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  );
}

@Controller('metadata-extraction')
export class MetadataExtractionController {
  constructor(private readonly metadataService: MetadataExtractionService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async extractFromUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: Category,
  ): Promise<ExtractionResult> {
    if (!file) throw new BadRequestException('Product file is required');
    if (!category) throw new BadRequestException('Product category is required');

    // เช็ค magic bytes ก่อน — ไม่เชื่อ extension หรือ mimetype จาก client
    if (!isZipBuffer(file.buffer)) {
      throw new BadRequestException('File must be a valid ZIP archive');
    }

    return this.metadataService.extractMetadataFromBuffer(category, file.buffer);
  }

  @Post('url')
  async extractFromUrl(
    @Body('category') category: Category,
    @Body('fileUrl') fileUrl: string,
  ): Promise<ExtractionResult> {
    return this.metadataService.extractMetadataFromUrl(category, fileUrl);
  }
}