export enum PaymentStatusEnum {
  PENDING = 'PENDING',   // รอ webhook จาก Omise
  SUCCESS = 'SUCCESS',   // Omise แจ้ง paid
  FAILED = 'FAILED',     // Omise แจ้ง failed / expired
}   