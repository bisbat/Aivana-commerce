export interface AddToCartRequest {
  userId: string; // UUID
  productId: number;
}

export interface AddToCartResponse {
  message: string;
  cartItem: {
    cartId: number;
    productId: number;
  };
}
