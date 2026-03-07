import { Controller, Post, Body } from '@nestjs/common';
import { IntentExtractionService } from './intent-extraction.service';

@Controller('ai')
export class IntentController {
  constructor(private readonly intentService: IntentExtractionService) {}

  @Post('extract-intent')
  async extractIntent(@Body('input') input: string) {
    return this.intentService.extractIntent(input);
  }
}
