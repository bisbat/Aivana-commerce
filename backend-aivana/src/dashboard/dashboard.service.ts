import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { SellerEntity } from 'src/sellers/entities/seller.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
  ){}

  getHello(): string {
    return 'Hello World!';
  }

   async getDashboardData(sellerId: string) {
    // return total products, total sales, etc. of sellerId
    // product total count example
    const productCount = await this.productRepository.count({ where: { seller: { id: sellerId } } });
    return {
      productCount,
      // add other dashboard data here
    };
  }
}
