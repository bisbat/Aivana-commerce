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

  async getSellerEarningsSummary(sellerId: string) {
    const rows = await this.payoutRepository
      .createQueryBuilder('p')
      .select('p.status', 'status')
      .addSelect('SUM(p.totalAmount)', 'amount')
      .where('p.sellerId = :sellerId', { sellerId })
      .groupBy('p.status')
      .getRawMany();

    let paidAmount = 0;
    let pendingAmount = 0;

    for (const r of rows) {
      if (r.status === 'paid') {
        paidAmount = Number(r.amount);
      }
      if (r.status === 'pending') {
        pendingAmount = Number(r.amount);
      }
    }

    return {
      paidAmount,
      pendingAmount,
    };
  }
}
