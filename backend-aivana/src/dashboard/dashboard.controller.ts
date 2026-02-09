import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getHello(): string {
    return this.dashboardService.getHello();
  }

  @Get(':id')
  @Public()
  async getDashboard(@Param('id') sellerId: string) {
    return this.dashboardService.getDashboardData(sellerId);
  }
}
