import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

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
      throw new Error('Product already in cart');
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
  async getCartByUserId(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      return {
        message: 'Cart not found for user',
        cart: null,
        items: [],
      };
    }

    return {
      message: 'Cart retrieved successfully',
      ...cart,
      totalItems: cart.items.length,
    };
  }

  async removeFromCart(userId: number, productId: number) {
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
