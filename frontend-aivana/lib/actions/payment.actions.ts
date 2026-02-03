"use server";
import { getAccessToken } from "../auth";
import { PromptpayQrResponse } from "../types/payment";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createPayment(
  sourceId: string,
  orderId: number,
) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/payment/charge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sourceId,
      orderId,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return response.json();
}

export async function fetchQrPromptpay(orderId: number) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(`${API_BASE_URL}/payment/qr/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return response.json() as Promise<PromptpayQrResponse>;
}
