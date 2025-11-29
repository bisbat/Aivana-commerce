import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/response-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get('user/:userId')
  getCartByUserId(@Param('userId') userId: string): Promise<CartResponseDto> {
    // ← เปลี่ยนจาก CartItemDto[]
    return this.cartService.getCartByUserId(userId);
  }

  @Delete('user/:userId/product/:productId')
  removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, +productId);
  }
}
