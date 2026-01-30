"use server";
import { getAccessToken } from "../auth";
import { CreateReviewDTO } from "../types/review";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createReviewAction(
  productId: string,
  createReviewDTO: CreateReviewDTO,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(createReviewDTO),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create review");
  }

  return await res.json();
}
