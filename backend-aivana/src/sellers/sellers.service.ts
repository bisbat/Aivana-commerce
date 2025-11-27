import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/constants/user-roles.enum';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async upgradeToSeller(userId: string, sellerData: CreateSellerDto): Promise<SellerEntity> {
    // ตรวจสอบว่า user มีอยู่จริง
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [ 'sellerProfile']
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

    return reloadedSeller || savedSeller;
  }

  async getAllSellers(): Promise<SellerEntity[]> {
    return await this.sellerRepository.find({relations: ['user']});
  }

  async getSellerById(id: string): Promise<SellerEntity | null> {
    return await this.sellerRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });
  }

}
