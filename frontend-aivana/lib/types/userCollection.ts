import { Product } from "./product/Product";
import { OrderItem } from "./orderItem";

// Product ทั้งหมด ยกเว้น seller, category, detailImages, tags
export type CollectionProduct = Omit<
  Product,
  "seller" | "category" | "detailImages" | "tags"
> & {
  hasReported?: boolean;
};

export type UserCollection = {
  id: number;
  userId: string;
  productId: string;
  orderItemId: number;
  createdAt: string;
  product: CollectionProduct;
  orderItem: OrderItem;
};
