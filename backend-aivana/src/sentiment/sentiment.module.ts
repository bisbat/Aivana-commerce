import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SentimentService } from './sentiment.service';
import { ReviewEntity } from 'src/review/entities/review.entity';

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([ReviewEntity])],
  providers: [SentimentService],
  exports: [SentimentService], 
})
export class SentimentModule {}
