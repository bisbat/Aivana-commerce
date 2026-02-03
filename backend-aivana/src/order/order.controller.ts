import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Get()
  async getUserOrders(@Req() req) {
    const userId = req.user.userId;
    return this.orderService.getOrdersByUserId(userId);
  }
}
