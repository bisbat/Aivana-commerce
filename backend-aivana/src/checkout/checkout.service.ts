import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { In } from 'typeorm/browser/find-options/operator/In.js';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) { }
  async create(createCheckoutDto: CreateCheckoutDto) {
    const { productIds } = createCheckoutDto;

    const products = await this.productRepository.findBy({
      id: In(productIds),
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products not found');
    }

    let totalAmount = 0;

    const summaryItems = products.map(product => {
      totalAmount += Number(product.price);

      return {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
      };
    });

    return {
      items: summaryItems,
      totalAmount,
    };
  }

  findAll() {
    return `This action returns all checkout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkout`;
  }

  update(id: number, updateCheckoutDto: UpdateCheckoutDto) {
    return `This action updates a #${id} checkout`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkout`;
  }
}
