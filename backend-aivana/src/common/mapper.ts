import { PaymentStatusEnum } from "src/order/enum/order-status.enum";

export function mapOmiseStatusToPaymentStatus(
  omiseStatus: string,
): PaymentStatusEnum {
  switch (omiseStatus) {
    case 'successful':
      return PaymentStatusEnum.PAID;

    case 'failed':
    case 'expired':
      return PaymentStatusEnum.FAILED;

    case 'pending':
    default:
      return PaymentStatusEnum.PENDING;
  }
}
