import { Controller, Post } from '@nestjs/common';

@Controller('order-items')
export class OrderItemController {
    constructor() {}
    @Post()
    async createOrderItem() {
        // Logic to handle order item creation
    }
}
