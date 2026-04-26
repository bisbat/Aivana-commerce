import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OmiseModule } from 'src/omise/omise.module';
import { OrderModule } from 'src/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [OmiseModule, OrderModule, TypeOrmModule.forFeature([PaymentEntity]), EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
