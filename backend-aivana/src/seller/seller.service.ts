import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { Repository } from 'typeorm';
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

    // Filter out deleted products
    const activeProducts = seller.products.filter((p) => !p.isDeleted);

    return this.productMapper.toResponseList(activeProducts);
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
        'p.periodStart AS "periodStart"',
        'p.periodEnd AS "periodEnd"',
        'p.totalAmount AS "netAmount"',
        'p.status AS "status"',
        'p.slipUrl AS "slipUrl"',
        'COALESCE(SUM(oi.price), 0) AS "grossSales"',
        'COALESCE(SUM(oi.price - oi.sellerAmount), 0) AS "commission"',
      ])
      .where('p.sellerId = :sellerId', { sellerId })
      .groupBy('p.id')
      .orderBy('p.periodStart', 'DESC')
      .getRawMany();

    return rows.map((r) => ({
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
}
