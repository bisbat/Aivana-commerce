import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportEntity } from './entities/report.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReportStatus } from 'src/constants/report-status.enum';
import { ReasonAutoHide } from './constants/reason-auto-hide';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private productService: ProductService,
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
      throw new NotFoundException('Order item not found');
    }

    // Check if user owns this order
    if (!orderItem.order) {
      throw new NotFoundException('Order information not found');
    }

    if (String(orderItem.order.userId) !== String(userId)) {
      throw new ForbiddenException(
        'You do not have permission to report this item',
      );
    }

    // Find existing report
    let existingReport = await this.reportRepository.findOne({
      where: { orderItem: { id: orderItemId } },
      relations: ['reportedBy', 'orderItem', 'orderItem.product'],
    });
    if (existingReport) {
      existingReport.reason = reason;
      existingReport.message = message;
      const saved = await this.reportRepository.save(existingReport);

      this.checkAutoHide(orderItem.product.id, reason).catch((error) => {
        throw new BadRequestException(
          'Error checking auto-hide: ' + error.message,
        );
      });

      return saved;
    }

    const newReport = this.reportRepository.create({
      reportedBy: { id: userId } as any,
      orderItem: orderItem,
      reason,
      message,
    });

    const saved = await this.reportRepository.save(newReport);
    this.checkAutoHide(orderItem.product.id, reason).catch((error) => {
      throw new BadRequestException(
        'Error checking auto-hide: ' + error.message,
      );
    });
    return saved;
  }

  async checkAutoHide(productId: number, reason: string): Promise<void> {
    const threshold = ReasonAutoHide[reason];
    if (!threshold) return;

    // นับเฉพาะ report ที่ reason เดียวกัน และยังไม่ถูก reject
    const count = await this.reportRepository.count({
      where: {
        reason,
        orderItem: { product: { id: productId } },
        status: Not(ReportStatus.REJECTED), // import Not from typeorm
      },
    });

    if (count >= threshold) {
      await this.productService.hideProduct(productId);
    }
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
        orderItem: { product: { isDeleted: false, isHidden: false } },
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
        throw new ForbiddenException(
          'You do not have permission to view reports for this product',
        );
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
      where: {
        orderItem: {
          product: { id: productId, isDeleted: false, isHidden: false },
        },
      },
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
      throw new NotFoundException('Report not found');
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
        'You are not a seller or have not registered as a seller',
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
      throw new ForbiddenException(
        'You do not have permission to delete this report',
      );
    }

    await this.reportRepository.remove(report);
  }
  async updateStatus(
    id: number,
    updateReportStatusDto: UpdateReportStatusDto,
  ): Promise<ReportEntity> {
    const report = await this.findOne(id);
    const { status } = updateReportStatusDto;

    const productId = report.orderItem?.product?.id;

    // cancel_sale → soft delete สินค้า
    if (status === ReportStatus.CANCEL_SALE && productId) {
      await this.productService.deleteProduct(
        productId,
        `Deleted by admin via report #${id}`,
      );
      await this.updateAllReportsByProductToCancelSale(productId);
      return report;
    }

    // resolved / rejected → unhide สินค้า (ถ้าถูกซ่อนอยู่)
    if (
      (status === ReportStatus.RESOLVED || status === ReportStatus.REJECTED) &&
      productId
    ) {
      await this.productService.unhideProduct(productId);
    }

    report.status = status;
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
      throw new NotFoundException('Report not found');
    }

    const sellerUserId = report.orderItem.product.seller?.user?.id;
    if (!sellerUserId || sellerUserId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to respond to this report',
      );
    }

    report.sellerRespondedAt = new Date();
    if (report.status === ReportStatus.PENDING) {
      report.status = ReportStatus.UNDER_REVIEW;
    }

    return await this.reportRepository.save(report);
  }
}
