import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OmiseModule } from 'src/omise/omise.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [OmiseModule, OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
