import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import type { UploadedFileType } from '../products/interfaces/uploaded-file.interface';

@Controller('files')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: UploadedFileType) {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalname}`;

    await this.minioService.uploadFile(file, fileName);
    const fileUrl = this.minioService.getFileUrl(fileName);

    return {
      message: 'File uploaded successfully',
      fileName: fileName,
      url: fileUrl,
    };
  }

  @Get('list')
  async listFiles() {
    const files = await this.minioService.listFiles();
    return {
      files,
    };
  }
}
