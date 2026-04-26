import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { Or, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Role } from 'src/auth/enum/role.enum';
import { plainToInstance } from 'class-transformer';
import { ResponseSellerDto } from './dto/response-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ResponseProductDto } from 'src/product/dto/response-product.dto';
import { ProductMapper } from 'src/product/product.mapper';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PayoutEntity } from 'src/payout/entities/payout.entity';
import { SellerEarningsSummaryDto } from './dto/seller-earnings-summary.dto';
import { SellerEarningsRoundDto } from './dto/seller-earnings-round.dto';
import {
  SellerRoundDetailDto,
  SellerRoundItemDto,
} from './dto/seller-round-detail.dto';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import {
  MonthlyPerformanceDto,
  SellerDashboardDto,
  TopSellingProductDto,
} from './dto/seller-dashboard.dto';
@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly productMapper: ProductMapper,
    private readonly jwtService: JwtService,
    @InjectRepository(PayoutEntity)
    private readonly payoutRepository: Repository<PayoutEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async upgradeToSeller(
    userId: string,
    sellerData: CreateSellerDto,
  ): Promise<{ accessToken: string }> {
    // ตรวจสอบว่า user มีอยู่จริง
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sellerProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ตรวจสอบว่ายังไม่เป็น seller อยู่แล้ว
    if (user.sellerProfile) {
      throw new Error('User is already a seller');
    }

    // สร้าง seller profile
    const seller = this.sellerRepository.create();
    seller.storeName = user.username + "'s Store";
    seller.user = user;
    Object.assign(seller, sellerData);

    const savedSeller = await this.sellerRepository.save(seller);

    // อัพเดท user role และ link seller profile
    user.role = Role.SELLER;
    user.sellerProfile = savedSeller;
    await this.userRepository.save(user);

    const JwtPayload = {
      sub: userId,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(JwtPayload);
    return { accessToken };
  }

  async getAllSellers(): Promise<ResponseSellerDto[]> {
    const sellers = await this.sellerRepository.find({ relations: ['user'] });
    return sellers.map((seller) =>
      plainToInstance(ResponseSellerDto, seller, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getSellerById(sellerId: string): Promise<ResponseSellerDto> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: ['user'],
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return plainToInstance(ResponseSellerDto, seller, {
      excludeExtraneousValues: true,
    });
  }

  async updateSellerProfile(
    sellerId: string,
    updateData: UpdateSellerDto,
  ): Promise<ResponseSellerDto> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: ['user'],
    });
    if (!seller) {
      throw new Error('Seller not found');
    }
    if (updateData) {
      Object.assign(seller.user, updateData.user);
      await this.userRepository.save(seller.user);
    }
    Object.assign(seller, updateData);
    const updatedSeller = await this.sellerRepository.save(seller);
    return plainToInstance(ResponseSellerDto, updatedSeller, {
      excludeExtraneousValues: true,
    });
  }

  async getProductsBySellerId(sellerId: string): Promise<ResponseProductDto[]> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: [
        'products',
        'products.category',
        'products.productImages',
        'products.tags',
        'products.seller',
        'products.seller.user',
      ],
    });

    if (!seller) return [];

    // Return all products including deleted ones (seller needs to see deletion notices)
    return this.productMapper.toResponseList(seller.products);
  }

  async getSellerByUsername(username: string): Promise<ResponseSellerDto> {
    const seller = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user')
      .where('user.username = :username', { username })
      .getOne();
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return plainToInstance(ResponseSellerDto, seller, {
      excludeExtraneousValues: true,
    });
  }

  async getSellerEarningsSummary(
    sellerId: string,
  ): Promise<SellerEarningsSummaryDto> {
    const rows = await this.payoutRepository
      .createQueryBuilder('p')
      .select([
        `SUM(CASE WHEN p.status = 'paid' THEN p.totalAmount ELSE 0 END) AS "paidAmount"`,
        `SUM(CASE WHEN p.status = 'pending' THEN p.totalAmount ELSE 0 END) AS "pendingAmount"`,
      ])
      .where('p.sellerId = :sellerId', { sellerId })
      .getRawOne();

    return {
      paidAmount: Number(rows.paidAmount || 0),
      pendingAmount: Number(rows.pendingAmount || 0),
    };
  }

  async getSellerEarningsRound(
    sellerId: string,
  ): Promise<SellerEarningsRoundDto[]> {
    const rows = await this.payoutRepository
      .createQueryBuilder('p')
      .leftJoin('p.payoutItem', 'pi')
      .leftJoin('pi.orderItem', 'oi')
      .select([
        'p.id AS "payoutId"',
        'p.periodStart AS "periodStart"',
        'p.periodEnd AS "periodEnd"',
        'p.status AS "status"',
        'p.slipUrl AS "slipUrl"',
        'COALESCE(SUM(oi.price), 0) AS "grossSales"',
        'COALESCE(SUM(oi.commissionAmount), 0) AS "commission"', // ← Fixed: use commissionAmount
        'COALESCE(SUM(oi.sellerAmount), 0) AS "netAmount"', // ← Fixed: calculate from items
      ])
      .where('p.sellerId = :sellerId', { sellerId })
      .groupBy('p.id')
      .addGroupBy('p.periodStart')
      .addGroupBy('p.periodEnd')
      .addGroupBy('p.status')
      .addGroupBy('p.slipUrl')
      .orderBy('p.periodStart', 'DESC')
      .getRawMany();

    return rows.map((r) => ({
      payoutId: Number(r.payoutId), // ← Also convert to number
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      grossSales: Number(r.grossSales),
      commission: Number(r.commission),
      netAmount: Number(r.netAmount),
      status: r.status,
      slipUrl: r.slipUrl,
    }));
  }

  async getSellerEarningsSummaryByUserId(
    userId: string,
  ): Promise<SellerEarningsSummaryDto> {
    const seller = await this.sellerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.getSellerEarningsSummary(seller.id);
  }

  async getSellerEarningsRoundByUserId(
    userId: string,
  ): Promise<SellerEarningsRoundDto[]> {
    const seller = await this.sellerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.getSellerEarningsRound(seller.id);
  }

  async getSellerRoundDetailByPayoutId(
    userId: string,
    payoutId: string,
  ): Promise<SellerRoundDetailDto> {
    const payoutIdNumber = Number(payoutId);

    const seller = await this.sellerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const payout = await this.payoutRepository.findOne({
      where: {
        id: payoutIdNumber,
        seller: { id: seller.id },
      },
      relations: {
        payoutItem: {
          orderItem: {
            product: true,
          },
        },
      },
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    const items: SellerRoundItemDto[] = payout.payoutItem.map((pi) => ({
      productName: pi.orderItem.product.name,
      price: Number(pi.orderItem.price),
      commission: Number(pi.orderItem.commissionAmount),
      sellerEarning: Number(pi.orderItem.sellerAmount),
    }));

    const totalGrossSales = items.reduce((sum, item) => sum + item.price, 0);
    const totalCommission = items.reduce(
      (sum, item) => sum + item.commission,
      0,
    );
    const totalNetAmount = items.reduce(
      (sum, item) => sum + item.sellerEarning,
      0,
    );

    return {
      payoutId: payoutIdNumber,
      periodStart: payout.periodStart.toISOString(),
      periodEnd: payout.periodEnd.toISOString(),
      totalGrossSales,
      totalCommission,
      totalNetAmount,
      items,
    };
  }

  // Add this method to your SellerService class

  async getSellerDashboard(userId: string): Promise<SellerDashboardDto> {
    // 1. Find seller by userId
    const seller = await this.sellerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 2. TOTAL REVENUE & TOTAL ITEMS SOLD
    // ───────────────────────────────────────────────────────────────────────────
    const totals = await this.orderItemRepository
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .select([
        'COALESCE(SUM(oi.sellerAmount), 0) AS "totalRevenue"',
        'COALESCE(COUNT(oi.id), 0) AS "totalItemsSold"',
      ])
      .where('oi.sellerId = :sellerId', { sellerId: seller.id })
      .andWhere('o.status = :status', { status: 'PAID' })
      .getRawOne();

    // ───────────────────────────────────────────────────────────────────────────
    // 3. MONTHLY PERFORMANCE (last 12 months)
    // ───────────────────────────────────────────────────────────────────────────
    const monthlyData = await this.orderItemRepository
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .select([
        `TO_CHAR(oi.createdAt, 'YYYY-MM') AS "month"`,
        'COALESCE(SUM(oi.sellerAmount), 0) AS "revenue"',
        'COALESCE(COUNT(oi.id), 0) AS "itemsSold"',
        'COALESCE(COUNT(DISTINCT o.id), 0) AS "ordersCount"',
      ])
      .where('oi.sellerId = :sellerId', { sellerId: seller.id })
      .andWhere('o.status = :status', { status: 'PAID' })
      .andWhere("oi.createdAt >= NOW() - INTERVAL '12 months'")
      .groupBy(`TO_CHAR(oi.createdAt, 'YYYY-MM')`)
      .orderBy(`TO_CHAR(oi.createdAt, 'YYYY-MM')`, 'ASC')
      .getRawMany();

    const monthlyPerformance: MonthlyPerformanceDto[] = monthlyData.map(
      (m) => ({
        month: m.month,
        revenue: Number(m.revenue),
        itemsSold: Number(m.itemsSold),
        ordersCount: Number(m.ordersCount),
      }),
    );

    // ───────────────────────────────────────────────────────────────────────────
    // 4. TOP SELLING PRODUCTS (top 5)
    // ───────────────────────────────────────────────────────────────────────────
    const topProducts = await this.orderItemRepository
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .innerJoin('oi.product', 'p')
      .select([
        'p.id AS "productId"',
        'p.name AS "productName"',
        'p.heroImageUrl AS "imageUrl"', // 👈 use this instead
        'COALESCE(COUNT(oi.id), 0) AS "totalSold"',
        'COALESCE(SUM(oi.sellerAmount), 0) AS "revenue"',
      ])
      .where('oi.sellerId = :sellerId', { sellerId: seller.id })
      .andWhere('o.status = :status', { status: 'PAID' })
      .groupBy('p.id')
      .addGroupBy('p.name')
      .addGroupBy('p.heroImageUrl') // ⚠ important because of group by
      .orderBy('COUNT(oi.id)', 'DESC')
      .limit(5)
      .getRawMany();

    const topSellingProducts: TopSellingProductDto[] = topProducts.map((p) => ({
      productId: Number(p.productId),
      productName: p.productName,
      imageUrl: p.imageUrl,
      totalSold: Number(p.totalSold),
      revenue: Number(p.revenue),
    }));

    // ───────────────────────────────────────────────────────────────────────────
    // RETURN DASHBOARD DATA
    // ───────────────────────────────────────────────────────────────────────────
    return {
      totalRevenue: Number(totals.totalRevenue),
      totalItemsSold: Number(totals.totalItemsSold),
      monthlyPerformance,
      topSellingProducts,
    };
  }
}
