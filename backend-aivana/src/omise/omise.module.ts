import { Module } from '@nestjs/common';
import { OmiseService } from './omise.service';
import { OmiseController } from './omise.controller';

@Module({
  controllers: [OmiseController],
  providers: [OmiseService],
  exports: [OmiseService]
})
export class OmiseModule {}
