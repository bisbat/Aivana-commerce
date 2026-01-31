import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entities/report.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async createOrUpdate(
    userId: string,
    createReportDto: CreateReportDto,
  ): Promise<ReportEntity> {
    const { orderItemId, reason, message } = createReportDto;
    // ตรวจสอบว่า orderItem มีอยู่จริง
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['order', 'product'],
    });

    if (!orderItem) {
      throw new NotFoundException('ไม่พบรายการสั่งซื้อนี้');
    }

    // ตรวจสอบว่า user เป็นเจ้าของ order นี้หรือไม่
    if (!orderItem.order) {
      throw new NotFoundException('ไม่พบข้อมูลคำสั่งซื้อ');
    }

    if (String(orderItem.order.userId) !== String(userId)) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์รายงานสินค้านี้');
    }

    // ค้นหา report ที่มีอยู่แล้ว
    let existingReport = await this.reportRepository.findOne({
      where: { orderItem: { id: orderItemId } },
      relations: ['reportedBy', 'orderItem', 'orderItem.product'],
    });

    if (existingReport) {
      // ตรวจสอบว่าเป็น user คนเดิมหรือไม่
      if (String(existingReport.reportedBy.id) !== String(userId)) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขรายงานนี้');
      }

      // อัพเดท report เดิม
      existingReport.reason = reason;
      existingReport.message = message;
      return await this.reportRepository.save(existingReport);
    }

    // สร้าง report ใหม่
    const newReport = this.reportRepository.create({
      reportedBy: { id: userId } as any,
      orderItem: orderItem,
      reason,
      message,
    });

    return await this.reportRepository.save(newReport);
  }

  async findByUser(userId: string): Promise<ReportEntity[]> {
    return await this.reportRepository.find({
      where: { reportedBy: { id: userId } },
      relations: ['orderItem', 'orderItem.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrderItem(orderItemId: number): Promise<ReportEntity | null> {
    return await this.reportRepository.findOne({
      where: { orderItem: { id: orderItemId } },
      relations: ['reportedBy', 'orderItem', 'orderItem.product'],
    });
  }

  async findAll(): Promise<ReportEntity[]> {
    return await this.reportRepository.find({
      relations: ['reportedBy', 'orderItem', 'orderItem.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ReportEntity> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['reportedBy', 'orderItem', 'orderItem.product'],
    });

    if (!report) {
      throw new NotFoundException('ไม่พบรายงานนี้');
    }

    return report;
  }

  // async findBySeller(sellerId: string): Promise<ReportEntity[]> {
  //   return await this.reportRepository
  //     .createQueryBuilder('report')
  //     .leftJoinAndSelect('report.reportedBy', 'reportedBy')
  //     .leftJoinAndSelect('report.orderItem', 'orderItem')
  //     .leftJoinAndSelect('orderItem.product', 'product')
  //     .where('product.sellerId = :sellerId', { sellerId })
  //     .orderBy('report.createdAt', 'DESC')
  //     .getMany();
  // }

  async remove(id: number, userId: string): Promise<void> {
    const report = await this.findOne(id);

    if (report.reportedBy.id !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบรายงานนี้');
    }

    await this.reportRepository.remove(report);
  }
}
