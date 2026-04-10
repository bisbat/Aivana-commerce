export interface AddToCartRequest {
  userId: string; 
  productId: number;
}

export interface AddToCartResponse {
  message: string;
  cartItem: {
    cartId: number;
    productId: number;
  };
}
