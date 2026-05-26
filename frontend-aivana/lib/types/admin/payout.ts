export interface PayoutRound {
  periodStart: string;
  periodEnd: string;
  sellerCount: number;
  totalAmount: number;
  roundStatus: "processing" | "completed";
}

export interface RoundDetailResponse {
  round: {
    periodStart: string;
    periodEnd: string;
    sellerCount: number;
    totalAmount: number;
  };
  sellers: Payout[];
}

export interface Payout {
  payoutId: number;
  sellerName: string;        
  orderCount: number;         
  grossSales: number;         
  netPayout: number;          
  status: string;             
}

export interface PayoutDetail {
  id: number;
  seller: {
    id: string;
    name: string;
  };
  totalAmount: number;
  status: "PENDING" | "PAID";
  periodStart: string;
  periodEnd: string;
  payoutItem: {
    amount: number;
    orderItem: {
      product: { name: string };
      order: { id: number };
    };
  }[];
}

export interface PayoutDetailResponse {
  payoutId: number;
  seller: {
    id: string;
    name: string;
    avatar: string | null;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  period: {
    start: string;
    end: string;
  };
  payout: {
    status: string;       
    amountDue: number;
    slipUrl: string | null;
    paidAt: string | null;
  };
  orders: {
    orderId: number;
    date: string;
    productName: string;
    price: number;
    commission: number;
    sellerEarn: number;
  }[];
  summary: {
    grossSales: number;
    totalCommission: number;
    netTransfer: number;
  };
}
