// ─── Payout Round (returned by GET /rounds) ────────────────────────────────
export interface PayoutRound {
  periodStart: string;
  periodEnd: string;
  sellerCount: number;
  totalAmount: number;
  roundStatus: "processing" | "completed";
}

// ─── NEW: Response from GET /rounds/:start/:end ─────────────────────────────
// Your backend now wraps the data in {round, sellers[]}
export interface RoundDetailResponse {
  round: {
    periodStart: string;
    periodEnd: string;
    sellerCount: number;
    totalAmount: number;
  };
  sellers: Payout[];
}

// ─── Single seller payout (inside the sellers[] array) ──────────────────────
export interface Payout {
  payoutId: number;
  sellerName: string;        // Backend sends "sellerName", not "seller"
  orderCount: number;         // Now included in the response
  grossSales: number;         // Now included in the response
  netPayout: number;          // Backend sends "netPayout", not "totalAmount"
  status: string;             // "รอโอน" or "โอนแล้ว" (Thai text)
}

// ─── For Page 3 (single seller detail) ─────────────────────────────────────
// This type stays the same since GET /:id still returns the full payout entity
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
    status: string;        // "รอโอน" or "โอนแล้ว"
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
