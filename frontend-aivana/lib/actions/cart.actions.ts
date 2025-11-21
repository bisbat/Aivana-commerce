import { AddToCartResponse, AddToCartRequest } from "@/lib/types/cart/AddCart";
import { GetCartResponse } from "@/lib/types/cart/GetCart";

export async function addToCart(
  data: AddToCartRequest
): Promise<AddToCartResponse> {
  const response = await fetch("http://localhost:3001/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export async function getCart(userId: number): Promise<GetCartResponse> {
  const response = await fetch(`http://localhost:3001/cart/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

export async function removeFromCart(
  userId: number,
  productId: number
): Promise<{ message: string }> {
  const response = await fetch(
    `http://localhost:3001/cart/user/${userId}/product/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove from cart");
  }

  return response.json();
}
