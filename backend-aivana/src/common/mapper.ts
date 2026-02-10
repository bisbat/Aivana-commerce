import { PaymentStatusEnum } from "src/payment/enum/payment-status.enum";

export function mapOmiseStatusToPaymentStatus(
  omiseStatus: string,
): PaymentStatusEnum {
  switch (omiseStatus) {
    case 'successful':
      return PaymentStatusEnum.SUCCESS;

    case 'failed':
      return PaymentStatusEnum.FAILED;
      
    case 'expired':
      return PaymentStatusEnum.EXPIRED;

    case 'pending':
    default:
      return PaymentStatusEnum.PENDING;
  }
}
