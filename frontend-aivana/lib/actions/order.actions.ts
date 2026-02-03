"use server";

import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getUserOrders() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  return await res.json();
}
