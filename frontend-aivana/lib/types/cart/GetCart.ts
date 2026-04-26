export interface GetCartResponse {
  message: string;
  cartId: number;
  userId: string; 
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
        id: string;
        firstName: string;
        lastName: string;
        username: string;
      } | null;
    };
  }>;
  totalItems: number;
}
