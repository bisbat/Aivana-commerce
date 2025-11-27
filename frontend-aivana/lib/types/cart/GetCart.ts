export interface GetCartResponse {
  message: string;
  cartId: number;
  userId: string; // UUID
  items: Array<{
    cartItemId: number;
    cartId: number;
    productId: number;
    product: {
      id: number;
      name: string;
      price: number;
      heroImageUrl: string;
      seller?: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
  totalItems: number;
}
