import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

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
    return await this.reportService.findByOrderItem(+orderItemId);
  }

  // ดู report ทั้งหมด (สำหรับ admin)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return await this.reportService.findAll();
  }

  // ดูรายงานที่ขายให้ตัวเอง (สำหรับ seller)
  // @Roles(Role.SELLER)
  // @Get('received')
  // async getReportsForSeller(@Req() req: any) {
  //   return this.reportService.findBySeller(req.user.userId);
  // }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.reportService.remove(+id, req.user.userId);
    return { message: 'ลบรายงานเรียบร้อยแล้ว' };
  }
}
