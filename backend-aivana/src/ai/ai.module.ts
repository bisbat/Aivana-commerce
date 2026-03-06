import { Module } from '@nestjs/common';
import { IntentExtractionService } from './intent-extraction.service';
import { IntentController } from './intent.controller';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [IntentController],
  providers: [GeminiService, IntentExtractionService],
  exports: [GeminiService, IntentExtractionService],
})
export class AiModule {}
