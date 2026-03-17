import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { IntentExtractionService } from 'src/ai/intent-extraction.service';

@Controller('bundle')
export class BundleController {
  constructor(
    private readonly bundleService: BundleService,
    private readonly intentService: IntentExtractionService
  ) { }

  @Post('recommend')
  async recommend(@Body('query') query: string) {
    const intent = await this.intentService.extractIntent(query)
    return this.bundleService.bundleRecommend(intent)
  }
  
}
