import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/constants/user-roles.enum';
import { plainToInstance } from 'class-transformer';
import { ResponseSellerDto } from './dto/response-seller.dto';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async upgradeToSeller(userId: string, sellerData: CreateSellerDto): Promise<string> {
    // ตรวจสอบว่า user มีอยู่จริง
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sellerProfile']
    });

    if (!user) {
      throw new Error('User not found');
    }

    // ตรวจสอบว่ายังไม่เป็น seller อยู่แล้ว
    if (user.sellerProfile) {
      throw new Error('User is already a seller');
    }

    // สร้าง seller profile
    const seller = this.sellerRepository.create();
    seller.user = user;
    seller.bio = sellerData.bio;
    seller.location = sellerData.location;
    seller.skills = sellerData.skills;
    seller.tools = sellerData.tools;
    seller.socialLinks = sellerData.socialLinks;
    seller.bankName = sellerData.bankName;
    seller.bankAccountNumber = sellerData.bankAccountNumber;
    seller.bankAccountName = sellerData.bankAccountName;

    const savedSeller = await this.sellerRepository.save(seller);

    // อัพเดท user role และ link seller profile
    user.role = UserRoles.SELLER;
    user.sellerProfile = savedSeller;
    await this.userRepository.save(user);

    // Reload seller with user relationship
    const reloadedSeller = await this.sellerRepository.findOne({
      where: { id: savedSeller.id },
      relations: ['user']
    });

    return 'Seller upgraded successfully';
  }

  async getAllSellers(): Promise<ResponseSellerDto[]> {
    const sellers = await this.sellerRepository.find({ relations: ['user'] });
    return sellers.map(seller => plainToInstance(ResponseSellerDto, seller, { excludeExtraneousValues: true }));
  }

  async getSellerByUsername(username: string): Promise<ResponseSellerDto | null> {
    const seller = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user')
      .where('user.username = :username', { username })
      .leftJoinAndSelect('seller.products', 'products')
      .getOne();
    return seller ? plainToInstance(ResponseSellerDto, seller, { excludeExtraneousValues: true }) : null;
  }
}
