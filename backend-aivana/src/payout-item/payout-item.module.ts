import { Module } from '@nestjs/common';
import { PayoutItemService } from './payout-item.service';
import { PayoutItemController } from './payout-item.controller';

@Module({
  controllers: [PayoutItemController],
  providers: [PayoutItemService],
})
export class PayoutItemModule {}
