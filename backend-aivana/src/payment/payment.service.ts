import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OmiseService } from 'src/omise/omise.service';
import { OrderService } from 'src/order/order.service';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { mapOmiseStatusToPaymentStatus } from 'src/common/mapper';
import { PaymentMethodEnum } from 'src/order/enum/payment.enum';
import { PaymentStatusEnum } from './enum/payment-status.enum';


@Injectable()
export class PaymentService {
  constructor(
    private readonly omiseService: OmiseService,
    private readonly orderService: OrderService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) { }

  async chargeWithSource(sourceId: string, orderId: number) {
    const order = await this.orderService.getOrderById(orderId)
    if (!order) {
      throw new BadRequestException('Order not found!')
    }

    const amount = Math.round(Number(order.totalAmount) * 100);

    const charge = await this.omiseService.createChargeWithSource(sourceId, amount)

    order.omiseChargeId = charge.id;
    await this.orderService['orderRepository'].save(order);

    const paymentStatus = mapOmiseStatusToPaymentStatus(
      charge.status,
    );

    await this.paymentRepository.save({
      orderId: orderId,
      paymentMethod: order.paymentMethod,
      amount: amount,
      chargeId: charge.id,
      sourceId: sourceId,
      qrImageUrl: charge.source?.scannable_code?.image?.download_uri,
      status: paymentStatus,
      createdAt: new Date(),
    })

    return {
      chargeId: charge.id,
      status: charge.status,
      qrImage: charge.source?.scannable_code?.image?.download_uri ?? null,
    }
  }

  async getQrPromptpay(orderId: number) {
    const payment = await this.paymentRepository.findOne({
      where: {
        orderId,
        paymentMethod: PaymentMethodEnum.PROMPTPAY,
      },
      order: { createdAt: 'DESC' },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatusEnum.SUCCESS) {
      return {
        status: PaymentStatusEnum.SUCCESS,
        redirect: '/payment/success',
      };
    }

    return {
      orderId,
      paymentId: payment.id,
      amount: payment.amount,
      status: payment.status,
      qrImageUrl: payment.qrImageUrl,
    };
  }

  async webhookOmiseCharge(event: any) {
    if (event.data.object !== 'charge') return;

    const charge = event.data;

    if (charge.status === 'successful') {
      await this.orderService.markAsPaid(charge.metadata.orderId);
    }

    if (charge.status === 'failed') {
      await this.orderService.markAsFailed(charge.metadata.orderId);
    }
  }




}
