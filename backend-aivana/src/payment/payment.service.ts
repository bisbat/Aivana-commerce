import { BadRequestException, Injectable } from '@nestjs/common';
import { OmiseService } from 'src/omise/omise.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly omiseService: OmiseService,
    private readonly orderService: OrderService
  ) { }

  async chargeWithSource(sourceId: string, orderId: number) {
    const order = await this.orderService.getOrderById(orderId)
    if (!order) {
      throw new BadRequestException('Order not found!')
    }

    const amount = Math.round(Number(order.totalAmount) * 100);

    const charge = await this.omiseService.createChargeWithSource(sourceId, amount)

    return {
      chargeId: charge.id,
      status: charge.status,
      qrImage: charge.source?.scannable_code?.image?.download_uri ?? null,
    }
  }
}
