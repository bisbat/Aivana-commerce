import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('charge')
  async charge(@Body() body: { sourceId: string; orderId: number },) {
    if (!body.sourceId || !body.orderId) {
      throw new BadRequestException('sourceId and orderId are required')
    }

    return this.paymentService.chargeWithSource(body.sourceId, body.orderId)
  }

  @Get('qr/:orderId')
  async getQrPromptpay(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.paymentService.getQrPromptpay(orderId);
  }

}
