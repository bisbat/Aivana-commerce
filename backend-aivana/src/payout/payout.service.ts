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

  async generatePayout(periodStart: Date, periodEnd: Date) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    // const now = new Date();

    // if (now < end) {
    //   throw new BadRequestException(
    //     'Cannot generate payout before period ends',
    //   );
    // }

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
      .andWhere('o.paidAt IS NOT NULL')
      .andWhere('o.paidAt >= :start', { start })
      .andWhere('o.paidAt < :end', { end })
      .getMany();

    if (orderItems.length === 0) {
      throw new NotFoundException('No order items found for payout');
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

  async getPayoutRounds() {
    const raw = await this.payoutRepo
      .createQueryBuilder('p')
      .select('p.periodStart', 'periodStart')
      .addSelect('p.periodEnd', 'periodEnd')
      .addSelect('COUNT(p.id)', 'sellerCount')
      .addSelect('SUM(p.totalAmount)', 'totalAmount')
      .addSelect(`
      CASE 
        WHEN SUM(CASE WHEN p.status = 'pending' THEN 1 ELSE 0 END) > 0
        THEN 'processing'
        ELSE 'completed'
      END
    `, 'roundStatus')
      .groupBy('p.periodStart')
      .addGroupBy('p.periodEnd')
      .orderBy('p.periodStart', 'DESC')
      .getRawMany();

    return raw.map(r => ({
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      sellerCount: Number(r.sellerCount),
      totalAmount: Number(r.totalAmount),
      roundStatus: r.roundStatus,
    }));
  }

  async getRoundDetail(periodStart: string, periodEnd: string) {
    const start = new Date(`${periodStart}T00:00:00+07:00`);
    const end = new Date(`${periodEnd}T23:59:59+07:00`);


    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    /**
     * 🟦 ROUND SUMMARY (CARD)
     * รวมยอดโอนทั้งรอบ + จำนวนร้าน
     */
    const roundSummary = await this.payoutRepo
      .createQueryBuilder('p')
      .select('COUNT(p.id)', 'sellerCount')
      .addSelect('SUM(p.totalAmount)', 'totalAmount')
      .where('p.periodStart >= :start', { start })
      .andWhere('p.periodEnd <= :end', { end })
      .getRawOne();

    /**
     * 🟨 SELLER TABLE
     */
    const sellers = await this.payoutRepo
      .createQueryBuilder('p')
      .leftJoin('p.seller', 's')
      .leftJoin('p.payoutItem', 'pi')
      .leftJoin('pi.orderItem', 'oi')

      .select('p.id', 'payoutId')
      .addSelect('s.storeName', 'sellerName')
      .addSelect('COUNT(oi.id)', 'orderCount')
      .addSelect('SUM(oi.price)', 'grossSales')
      .addSelect('SUM(oi.sellerAmount)', 'calculatedNet')
      .addSelect('p.totalAmount', 'netPayout')
      .addSelect('p.status', 'status')

      .where('p.periodStart >= :start', { start })
      .andWhere('p.periodEnd <= :end', { end })

      .groupBy('p.id')
      .addGroupBy('s.storeName')
      .addGroupBy('p.totalAmount')
      .addGroupBy('p.status')

      .orderBy('s.storeName', 'ASC')
      .getRawMany();


    return {
      round: {
        periodStart,
        periodEnd,
        sellerCount: Number(roundSummary?.sellerCount || 0),
        totalAmount: Number(roundSummary?.totalAmount || 0),
      },

      sellers: sellers.map(r => ({
        payoutId: Number(r.payoutId),
        sellerName: r.sellerName,
        orderCount: Number(r.orderCount),
        grossSales: Number(r.grossSales || 0),
        netPayout: Number(r.netPayout),
        calculatedFromItems: Number(r.calculatedNet),
        status: r.status === 'paid' ? 'โอนแล้ว' : 'รอโอน',
      })),
    };
  }

  async getSellerPayoutDetail(payoutId: number) {
    const payout = await this.payoutRepo.findOne({
      where: { id: payoutId },
      relations: {
        seller: {
          user: true,
        },
        payoutItem: {
          orderItem: {
            order: true,
            product: true,
          },
        },
      },
    });

    if (!payout) throw new NotFoundException('Payout not found');

    const items = payout.payoutItem.map(pi => pi.orderItem);

    // ───────────────── SUMMARY CALCULATION ─────────────────
    const grossSales = items.reduce((sum, i) => sum + Number(i.price), 0);
    const totalCommission = items.reduce(
      (sum, i) => sum + Number(i.commissionAmount),
      0,
    );
    const netTransfer = items.reduce(
      (sum, i) => sum + Number(i.sellerAmount),
      0,
    );

    return {
      payoutId: payout.id,

      // SELLER CARD
      seller: {
        id: payout.seller.id,
        name: payout.seller.storeName,
        avatar: payout.seller.user?.avatarUrl || null, // ถ้ามีใน user
        bankName: payout.seller.bankInfo?.bankName,
        accountNumber: payout.seller.bankInfo?.accountNumber,
        accountName: payout.seller.bankInfo?.accountName,
      },

      // PERIOD
      period: {
        start: payout.periodStart,
        end: payout.periodEnd,
      },

      // STATUS + AMOUNT DUE
      payout: {
        status: payout.status === "paid" ? 'โอนแล้ว' : 'รอโอน',
        amountDue: Number(payout.totalAmount),
        slipUrl: payout.slipUrl,
        paidAt: payout.paidAt,
      },

      // ORDER BREAKDOWN TABLE
      orders: items.map(i => ({
        orderId: i.order.id,
        date: i.createdAt,
        productName: i.product.name,
        price: Number(i.price),
        commission: Number(i.commissionAmount),
        sellerEarn: Number(i.sellerAmount),
      })),

      // SUMMARY BOX
      summary: {
        grossSales,
        totalCommission,
        netTransfer,
      },
    };
  }

  async generateManualPayout(
    periodStart: string,
    periodEnd: string,
  ) {
    const bangkokOffset = 7 * 60;

    // Thailand start midnight
    const startBangkok = new Date(`${periodStart}T00:00:00`);
    const endBangkok = new Date(`${periodEnd}T00:00:00`);

    // Convert to UTC
    const startUTC = new Date(
      startBangkok.getTime() - bangkokOffset * 60 * 1000,
    );

    // End is exclusive → add 1 day
    const endUTC = new Date(
      endBangkok.getTime() +
      24 * 60 * 60 * 1000 -
      bangkokOffset * 60 * 1000,
    );

    return this.generatePayout(startUTC, endUTC);
  }




}
