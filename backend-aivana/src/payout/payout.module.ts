import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutEntity } from './entities/payout.entity';
import { PayoutItemEntity } from '../payout-item/entities/payout-item.entity';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { PayoutService } from './payout.service';
import { InternalPayoutController } from './internal-payout.controller';
import { AdminPayoutController } from './admin-payout.controller';
import { MinioModule } from 'src/minio/minio.module';
import { PayoutCronService } from './payout-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayoutEntity,
      PayoutItemEntity,
      OrderItemEntity,
    ]),
    MinioModule,
  ],
  controllers: [
    InternalPayoutController,
    AdminPayoutController
  ],
  providers: [PayoutService, PayoutCronService],
})
export class PayoutModule {}
