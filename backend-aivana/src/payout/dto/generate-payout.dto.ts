import { IsDateString } from 'class-validator';

export class GeneratePayoutDto {
  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;
}
