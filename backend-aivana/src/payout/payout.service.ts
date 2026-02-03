import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { PayoutEntity } from './entities/payout.entity';
import { PayoutItemEntity } from '../payout-item/entities/payout-item.entity';
import { PayoutStatus } from 'src/constants/payout.enum';
import { MINIO_FOLDERS } from 'src/constants/minio-folders.constant';
import { MinioService } from 'src/minio/minio.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';


@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,

    @InjectRepository(PayoutEntity)
    private readonly payoutRepo: Repository<PayoutEntity>,

    @InjectRepository(PayoutItemEntity)
    private readonly payoutItemRepo: Repository<PayoutItemEntity>,

    private readonly minioService: MinioService,
  ) { }

  async generatePayout(periodStart: string, periodEnd: string) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    const existingPayout = await this.payoutRepo.findOne({
      where: {
        periodStart: start,
        periodEnd: end,
      },
    });

    if (existingPayout) {
      throw new ConflictException(
        'Payout for this period has already been generated',
      );
    }

    // 1. หา order_item ที่ยังไม่ถูก payout
    const orderItems = await this.orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin(PayoutItemEntity, 'pi', 'pi.orderItemId = oi.id')
      .innerJoin('oi.order', 'o')
      .where('pi.id IS NULL')
      .andWhere('o.status = :status', { status: 'PAID' })
      .andWhere('oi.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();



    if (orderItems.length === 0) {
      return { message: 'No order items to payout' };
    }

    // 2. group ตาม seller
    const sellerMap = new Map<string, typeof orderItems>();

    for (const item of orderItems) {
      if (!sellerMap.has(item.sellerId)) {
        sellerMap.set(item.sellerId, []);
      }
      sellerMap.get(item.sellerId)!.push(item);
    }

    // 3. สร้าง payout ต่อ seller
    for (const [sellerId, items] of sellerMap.entries()) {
      const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.sellerAmount),
        0,
      );

      const payout = this.payoutRepo.create({
        seller: { id: sellerId } as any,
        periodStart: start,
        periodEnd: end,
        totalAmount,
        status: PayoutStatus.PENDING,
      });

      await this.payoutRepo.save(payout);

      for (const item of items) {
        const payoutItem = this.payoutItemRepo.create({
          payout,
          orderItem: item,
          amount: item.sellerAmount,
        });
        await this.payoutItemRepo.save(payoutItem);
      }
    }

    return { message: 'Payout generated successfully' };
  }

  async getAllPayoutsForAdmin() {
    return this.payoutRepo.find({
      relations: {
        seller: true,
        payoutItem: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getPayoutDetailForAdmin(id: number) {
    const payout = await this.payoutRepo.findOne({
      where: { id },
      relations: {
        seller: true,
        payoutItem: {
          orderItem: {
            order: true,
            product: true,
          },
        },
      },
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    return payout;
  }

  async markPaid(payoutId: number, slip: UploadedFileType) {
    const payout = await this.payoutRepo.findOne({ where: { id: payoutId } });

    if (!payout) throw new NotFoundException('Payout not found');

    if (payout.status === PayoutStatus.PAID) {
      throw new BadRequestException('Payout already marked as paid');
    }
    
    const folder = MINIO_FOLDERS.PAYOUT.SLIP(payoutId);

    const fileName = `slip-${Date.now()}-${slip.originalname}`;

    const path = await this.minioService.uploadFile(slip, fileName, folder);

    const url = this.minioService.getFileUrl(path);

    payout.slipPath = path;
    payout.slipUrl = url;
    payout.paidAt = new Date();
    payout.status = PayoutStatus.PAID;

    await this.payoutRepo.save(payout);

    return payout;
  }


}
