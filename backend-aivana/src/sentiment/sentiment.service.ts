import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SentimentService {
  private readonly logger = new Logger(SentimentService.name);
  private readonly pythonUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {
    const pythonUrl = this.configService.get<string>('SENTIMENT_API_URL');
    if (!pythonUrl) {
      throw new Error('SENTIMENT_API_URL must be defined');
    }
    this.pythonUrl = pythonUrl;
  }

  async analyze(reviewId: number, text: string): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.pythonUrl}/predict`, { text }),
      );

      await this.reviewRepository.update(reviewId, {
        sentimentLabel: data.label,
        confidence: data.confidence,
        posScore: data.all_probabilities.pos,
        neuScore: data.all_probabilities.neu,
        negScore: data.all_probabilities.neg,
        analyzedAt: new Date(),
      });

      this.logger.log(
        `Review ${reviewId} → ${data.label} (${data.confidence})`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      this.logger.error(`Sentiment failed for review ${reviewId}: ${message}`);
    }
  }
}
