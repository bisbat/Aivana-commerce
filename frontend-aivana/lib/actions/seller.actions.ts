"use server";
import { SellerProfile } from "../types/user.ts/sellerProfile";
import { CreateSellerProfileDto } from "../types/user.ts/sellerCreate";
import { Product } from "../types/product/Product";
import { getCurrentUserFromToken } from "./auth.actions";

export async function becomeSeller(
  data: CreateSellerProfileDto
): Promise<SellerProfile> {
  const user = getCurrentUserFromToken();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `http://localhost:3001/seller/upgrade/${user.sub}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to become seller");
  }

  return await response.json();
}

export async function getProductsBySellerId(
  sellerId: string,
  token: string 
): Promise<Product[]> {
  const response = await fetch(
    `http://localhost:3001/seller/${sellerId}/products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch products");
  }

  return await response.json();
}


export async function getSellerById(
  sellerId: string | null,
  token: string | null
): Promise<SellerProfile | null> {

  if (!sellerId) return null;
  if (!token) return null;

  const response = await fetch(`http://localhost:3001/seller/${sellerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch seller");
  }

  return await response.json();
}
