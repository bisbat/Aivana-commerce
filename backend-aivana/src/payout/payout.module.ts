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
import { SlipVerificationService } from './slip-verification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayoutEntity,
      PayoutItemEntity,
      OrderItemEntity,
    ]),
    MinioModule,
    HttpModule,
  ],
  controllers: [
    InternalPayoutController,
    AdminPayoutController
  ],
  providers: [PayoutService, PayoutCronService, SlipVerificationService],
})
export class PayoutModule {}
