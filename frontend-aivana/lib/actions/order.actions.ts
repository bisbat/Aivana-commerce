import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PROMPTPAY = 'promptpay',
}

export async function createOrder(paymentMethod: PaymentMethod) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentMethod
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return response.json();
}