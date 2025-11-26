export interface GetCartResponse {
  message: string;
  cartId: number;
  userId: number;
  items: Array<{
    cartItemId: number;
    cartId: number;
    productId: number;
    product: {
      id: number;
      name: string;
      price: number;
      hero_image_url: string;
      owner?: {
        first_name: string;
        last_name: string;
      };
    };
  }>;
  totalItems: number;
}
