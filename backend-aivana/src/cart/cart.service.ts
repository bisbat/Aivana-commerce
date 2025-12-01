import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { plainToInstance } from 'class-transformer';
import { CartResponseDto } from './dto/response-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  /**
   * Add product to cart
   * If cart doesn't exist for user, create new cart
   * Each product can only be added once (no duplicates)
   */
  async addToCart(addToCartDto: AddToCartDto) {
    const { userId, productId } = addToCartDto;

    // Find or create cart for user
    const existingCart = await this.cartRepository.findOne({
      where: { userId },
    });

    const cart = existingCart
      ? existingCart
      : await this.cartRepository.save(this.cartRepository.create({ userId }));

    // Check if product already in cart BEFORE creating anything
    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.cartId, productId: productId },
    });

    if (existingItem) {
      throw new ConflictException('Product already in cart');
    }

    // Only create and save if validation passed
    const cartItem = await this.cartItemRepository.save({
      cartId: cart.cartId,
      productId: productId,
    });

    return {
      message: 'Product added to cart successfully',
      cartItem,
    };
  }

  /**
   * Get cart by user ID with all items and product details
   */
  async getCartByUserId(userId: string): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: [
        'items',
        'items.product',
        'items.product.seller',
        'items.product.seller.user',
      ],
    });

    if (!cart) {
      return plainToInstance(CartResponseDto, {
        message: 'Cart not found for user',
        cartId: 0,
        userId,
        items: [],
        totalItems: 0,
      });
    }

    const cartData = {
      message: 'Cart retrieved successfully',
      cartId: cart.cartId,
      userId: cart.userId,
      totalItems: cart.items.length,
      items: cart.items.map((item) => ({
        cartItemId: item.cartItemId,
        cartId: item.cartId,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          heroImageUrl: item.product.heroImageUrl,
          seller: {
            id: item.product.seller.id,
            firstName: item.product.seller.user.firstName,
            lastName: item.product.seller.user.lastName,
          },
        },
      })),
    };

    // ลบ excludeExtraneousValues ออก
    return plainToInstance(CartResponseDto, cartData);
  }

  async removeFromCart(userId: string, productId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found for user');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.cartId, productId: productId },
    });

    if (!cartItem) {
      throw new Error('Product not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);

    return {
      message: 'Product removed from cart successfully',
    };
  }
}
