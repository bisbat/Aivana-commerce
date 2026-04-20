import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':id')
  @Public()
  async getDashboard(@Param('id') sellerId: string) {
    return this.dashboardService.getDashboardData(sellerId);
  }

  @Get(':id/stats')
  @Public()
  async getStats(
    @Param('id') sellerId: string,
    @Query('days') days: number = 30,
  ) {
    return this.dashboardService.getStats(sellerId, days);
  }

  @Get(':id/trend')
  @Public()
  async getTrend(
    @Param('id') sellerId: string,
    @Query('weeks') weeks: number = 4,
  ) {
    return this.dashboardService.getTrend(sellerId, weeks);
  }
  
  @Get(':id/reviews')
  @Public()
  async getReviews(
    @Param('id') sellerId: string,
    @Query('sentiment') sentiment?: 'pos' | 'neu' | 'neg',
    @Query('limit') limit: number = 20,
  ) {
    return this.dashboardService.getReviews(sellerId, sentiment, limit);
  }
}