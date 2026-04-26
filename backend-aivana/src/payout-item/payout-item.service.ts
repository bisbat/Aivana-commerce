import { Injectable } from '@nestjs/common';
import { CreatePayoutItemDto } from './dto/create-payout-item.dto';
import { UpdatePayoutItemDto } from './dto/update-payout-item.dto';

@Injectable()
export class PayoutItemService {
  create(createPayoutItemDto: CreatePayoutItemDto) {
    return 'This action adds a new payoutItem';
  }

  findAll() {
    return `This action returns all payoutItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payoutItem`;
  }

  update(id: number, updatePayoutItemDto: UpdatePayoutItemDto) {
    return `This action updates a #${id} payoutItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} payoutItem`;
  }
}
