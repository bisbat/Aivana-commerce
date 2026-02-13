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

  // ดูรายงานของตัวเอง
  @Get('my-reports')
  async getMyReports(@Req() req: any) {
    return await this.reportService.findByUser(req.user.userId);
  }

  // ดู report ตาม orderItemId
  @Get('order-item/:orderItemId')
  async getByOrderItem(@Param('orderItemId') orderItemId: string) {
    const report = await this.reportService.findByOrderItem(+orderItemId);
    if (!report) {
      throw new NotFoundException('ไม่พบรายงานสำหรับรายการสั่งซื้อนี้');
    }
    return report;
  }

  // ดู report ทั้งหมด (สำหรับ admin)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return await this.reportService.findAll();
  }

  // ดู report ตาม productId (สำหรับ admin และ seller ที่เป็นเจ้าของสินค้า)
  @Roles(Role.ADMIN, Role.SELLER, Role.CUSTOMER)
  @Get('product/:productId')
  async getByProduct(@Req() req: any, @Param('productId') productId: string) {
    return await this.reportService.findByProduct(
      +productId,
      req.user.userId,
      req.user.role,
    );
  }

  // ดูรายงานที่เกี่ยวกับสินค้าของตัวเอง (สำหรับ seller)
  @Roles(Role.SELLER, Role.CUSTOMER)
  @Get('received')
  async getReportsForSeller(@Req() req: any) {
    return this.reportService.findBySellerUserId(req.user.userId);
  }

  // ดู report by id (สำหรับ admin)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reportService.findOne(+id);
  }

  // อัปเดตสถานะ report (สำหรับ admin)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto,
  ) {
    return await this.reportService.updateStatus(+id, updateReportStatusDto);
  }

  // Seller ตอบกลับรายงาน (บันทึกเฉพาะเวลาที่ตอบกลับ)
  @Roles(Role.SELLER)
  @Patch(':id/seller-response')
  async addSellerResponse(@Req() req: any, @Param('id') id: string) {
    return await this.reportService.addSellerResponse(+id, req.user.userId);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.reportService.remove(+id, req.user.userId);
    return { message: 'ลบรายงานเรียบร้อยแล้ว' };
  }
}
