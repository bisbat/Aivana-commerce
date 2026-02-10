export interface PromptpayQrResponse {
  orderId: number;
  paymentId: number;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  qrImageUrl: string;
  redirect: string;
  action: 'SHOW_QR' | 'REDIRECT';
}
 