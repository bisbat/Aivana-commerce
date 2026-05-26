import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ParseIntPipe, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/auth/decorators/public.decorator';

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

  @Post('charge/card')
  async chargeWithToken(@Body() body: { omiseToken: string; orderId: number },) {
    if (!body.omiseToken || !body.orderId) {
      throw new BadRequestException('omiseToken and orderId are required')
    }

    return this.paymentService.chargeWithToken(body.omiseToken, body.orderId)
  }

  @Get('qr/:orderId')
  async getQrPromptpay(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.paymentService.getQrPromptpay(orderId);
  }

  @Public()
  @Post('webhook/omise/charge')
  async webhookOmiseCharge(@Req() req: Request, @Body() body: any) {
    await this.paymentService.webhookOmiseCharge(body);

    return { received: true };
  }

  @Post('cancel/:orderId')
  async cancelPayment(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.cancelPayment(orderId);
  }

}
