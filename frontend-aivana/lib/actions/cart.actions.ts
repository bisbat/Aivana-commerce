"use server";
import { AddToCartResponse, AddToCartRequest } from "@/lib/types/cart/AddCart";
import { GetCartResponse } from "@/lib/types/cart/GetCart";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function addToCart(
  data: AddToCartRequest
): Promise<AddToCartResponse> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    // Check if it's a 409 Conflict (product already in cart)
    if (response.status === 409) {
      throw new Error("PRODUCT_ALREADY_IN_CART");
    }
    throw new Error(error.message || "Failed to add to cart");
  }

  return response.json();
}

export async function getCart(
  userId: string
): Promise<GetCartResponse> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(`${API_BASE_URL}/cart/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

export async function removeFromCart(
  userId: string,
  productId: number
): Promise<{ message: string }> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(
    `${API_BASE_URL}/cart/user/${userId}/product/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove from cart");
  }

  return response.json();
}
