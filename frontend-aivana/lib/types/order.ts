import { PaymentStatus } from "../constants/paymentStatus";
import { PaymentMethod } from "../constants/paymentMethod";

export type Order = {
  id: number;
  userId: string;
  totalAmount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  omiseChargeId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetail[];
};

export type OrderItemDetail = {
  id: number;
  orderId: number;
  productId: string;
  sellerId: string;
  price: string;
  commissionRate: string;
  commissionAmount: string;
  sellerAmount: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    heroImageUrl: string | null;
  };
};
