import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { SellerResponseDto } from './dto/seller-response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { NotFoundException } from '@nestjs/common';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles(Role.SELLER, Role.CUSTOMER)
  @Post()
  async createOrUpdate(
    @Req() req: any,
    @Body() createReportDto: CreateReportDto,
  ) {
    return await this.reportService.createOrUpdate(
      req.user.userId,
      createReportDto,
    );
  }

  @Get('my-reports')
  async getMyReports(@Req() req: any) {
    return await this.reportService.findByUser(req.user.userId);
  }

  @Get('order-item/:orderItemId')
  async getByOrderItem(@Param('orderItemId') orderItemId: string) {
    const report = await this.reportService.findByOrderItem(+orderItemId);
    if (!report) {
      throw new NotFoundException('Report not found for this order item');
    }
    return report;
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return await this.reportService.findAll();
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.CUSTOMER)
  @Get('product/:productId')
  async getByProduct(@Req() req: any, @Param('productId') productId: string) {
    return await this.reportService.findByProduct(
      +productId,
      req.user.userId,
      req.user.role,
    );
  }

  @Roles(Role.SELLER, Role.CUSTOMER)
  @Get('received')
  async getReportsForSeller(@Req() req: any) {
    return this.reportService.findBySellerUserId(req.user.userId);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reportService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto,
  ) {
    return await this.reportService.updateStatus(+id, updateReportStatusDto);
  }

  @Roles(Role.SELLER)
  @Patch(':id/seller-response')
  async addSellerResponse(@Req() req: any, @Param('id') id: string) {
    return await this.reportService.addSellerResponse(+id, req.user.userId);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.reportService.remove(+id, req.user.userId);
    return { message: 'Deleted successfully' };
  }
}
