import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportEntity } from './entities/report.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReportStatus } from 'src/constants/report-status.enum';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
      where: {
        orderItem: { product: { isDeleted: false } },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByProduct(
    productId: number,
    userId?: string,
    userRole?: string,
  ): Promise<ReportEntity[]> {
    // ถ้าไม่ใช่ admin ต้องเช็คว่าเป็นเจ้าของสินค้าหรือไม่
    if (userRole !== 'admin' && userId) {
      // ตรวจสอบว่า user เป็นเจ้าของสินค้านี้หรือไม่
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['sellerProfile'],
      });

      if (!user || !user.sellerProfile) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์ดูรายงานสินค้านี้');
      }

      // เช็คว่าสินค้าเป็นของ seller นี้จริงหรือไม่
      const reports = await this.reportRepository
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.reportedBy', 'reportedBy')
        .leftJoinAndSelect('report.orderItem', 'orderItem')
        .leftJoinAndSelect('orderItem.product', 'product')
        .leftJoinAndSelect('product.seller', 'seller')
        .where('product.id = :productId', { productId })
        .andWhere('seller.id = :sellerId', { sellerId: user.sellerProfile.id })
        .orderBy('report.createdAt', 'DESC')
        .getMany();

      return reports;
    }

    // สำหรับ admin ดูได้ทั้งหมด
    return await this.reportRepository.find({
      where: { orderItem: { product: { id: productId } } },
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

  async findBySeller(sellerId: string): Promise<ReportEntity[]> {
    return await this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reportedBy', 'reportedBy')
      .leftJoinAndSelect('report.orderItem', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('product.sellerId = :sellerId', { sellerId })
      .orderBy('report.createdAt', 'DESC')
      .getMany();
  }

  async findBySellerUserId(userId: string): Promise<ReportEntity[]> {
    // ตรวจสอบว่า user มี seller profile หรือไม่
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sellerProfile'],
    });

    if (!user || !user.sellerProfile) {
      throw new NotFoundException(
        'คุณไม่ได้เป็น seller หรือยังไม่ได้สมัครเป็น seller',
      );
    }

    return await this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reportedBy', 'reportedBy')
      .leftJoinAndSelect('report.orderItem', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('seller.user', 'sellerUser')
      .where('sellerUser.id = :userId', { userId })
      .orderBy('report.createdAt', 'DESC')
      .getMany();
  }

  async remove(id: number, userId: string): Promise<void> {
    const report = await this.findOne(id);

    if (report.reportedBy.id !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบรายงานนี้');
    }

    await this.reportRepository.remove(report);
  }

  async updateStatus(
    id: number,
    updateReportStatusDto: UpdateReportStatusDto,
  ): Promise<ReportEntity> {
    const report = await this.findOne(id);

    report.status = updateReportStatusDto.status;
    return await this.reportRepository.save(report);
  }

  async addSellerResponse(
    reportId: number,
    userId: string,
  ): Promise<ReportEntity> {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: [
        'reportedBy',
        'orderItem',
        'orderItem.product',
        'orderItem.product.seller',
        'orderItem.product.seller.user',
      ],
    });

    if (!report) {
      throw new NotFoundException('ไม่พบรายงานนี้');
    }

    // ตรวจสอบว่า user เป็นเจ้าของสินค้าที่ถูกรายงานหรือไม่
    const sellerUserId = report.orderItem.product.seller?.user?.id;
    if (!sellerUserId || sellerUserId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ตอบกลับรายงานนี้');
    }

    // บันทึกเวลาที่ตอบกลับและเปลี่ยนสถานะเป็น under_review
    report.sellerRespondedAt = new Date();
    if (report.status === ReportStatus.PENDING) {
      report.status = ReportStatus.UNDER_REVIEW;
    }

    return await this.reportRepository.save(report);
  }

  async updateAllReportsByProductToCancelSale(
    productId: number,
  ): Promise<number> {
    const subQuery = this.reportRepository
      .createQueryBuilder('oi')
      .select('oi.id')
      .from(OrderItemEntity, 'oi')
      .where('oi.productId = :productId', { productId })
      .getQuery();

    const result = await this.reportRepository
      .createQueryBuilder()
      .update(ReportEntity)
      .set({ status: ReportStatus.CANCEL_SALE })
      .where('orderItemId IN ' + subQuery)
      .setParameter('productId', productId)
      .execute();

    return result.affected || 0;
  }
}
