export interface AddToCartRequest {
  userId: number;
  productId: number;
}

export interface AddToCartResponse {
  message: string;
  cartItem: {
    cartId: number;
    productId: number;
  };
}
