export class ResCheckoutDto {
    checkoutId: number;
    userId: string;
    productIds: number[];
    totalAmount: number;
    createdAt: Date;
}