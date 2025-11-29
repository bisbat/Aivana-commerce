"use server";
import { getAuthData } from "./auth.actions";
import { SellerProfile } from "../types/user.ts/sellerProfile";
import { CreateSellerProfileDto } from "../types/user.ts/sellerCreate";
import { Product } from "../types/product/Product";

export async function becomeSeller(
  data: CreateSellerProfileDto
): Promise<SellerProfile> {
  const authData = getAuthData();

  if (!authData.accessToken || !authData.user) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `http://localhost:3001/seller/upgrade/${authData.user.id}`,
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
  sellerId: string
): Promise<Product[]> {
  const response = await fetch(
    `http://localhost:3001/seller/${sellerId}/products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch products");
  }

  return await response.json();
}

export async function getSellerById(sellerId: string): Promise<SellerProfile> {
  const response = await fetch(`http://localhost:3001/sellers/${sellerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch seller");
  }

  return await response.json();
}