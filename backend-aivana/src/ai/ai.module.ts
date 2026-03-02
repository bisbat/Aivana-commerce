import { Module } from '@nestjs/common';
import { IntentExtractionService } from './intent-extraction.service';
import { IntentController } from './intent.controller';

@Module({
  controllers: [IntentController],
  providers: [IntentExtractionService],
  exports: [IntentExtractionService],
})
export class AiModule {}
