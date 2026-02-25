export type ReportStatus =
  | "pending"
  | "under_review"
  | "resolved"
  | "rejected"
  | "cancel_sale";

export interface Report {
  id: number;
  status: ReportStatus;
  reportedBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orderItem: {
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      price: number;
      imageUrl?: string;
      isDeleted: boolean;
      isHidden: boolean;
      hiddenAt?: string;
      deletedAt?: string;
      deletionReason?: string;
    };
  };
  reason: string;
  message?: string;
  sellerRespondedAt?: string;
  createdAt: string;
  updatedAt: string;
}
