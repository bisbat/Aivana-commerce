import { PaymentStatusEnum } from "src/payment/enum/payment-status.enum";

export function mapOmiseStatusToPaymentStatus(
  omiseStatus: string,
): PaymentStatusEnum {
  switch (omiseStatus) {
    case 'successful':
      return PaymentStatusEnum.SUCCESS;

    case 'failed':
    case 'expired':
      return PaymentStatusEnum.FAILED;

    case 'pending':
    default:
      return PaymentStatusEnum.PENDING;
  }
}
