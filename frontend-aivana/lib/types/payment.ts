export interface PromptpayQrResponse {
  orderId: number;
  paymentId: number;
  status: 'pending' | 'paid' | 'failed';
  qrImageUrl?: string;
  redirect?: string;
}
