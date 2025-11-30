export interface AddToCartRequest {
  userId: string; // UUID
  productId: number;
  accessToken: string
}

export interface AddToCartResponse {
  message: string;
  cartItem: {
    cartId: number;
    productId: number;
  };
}
