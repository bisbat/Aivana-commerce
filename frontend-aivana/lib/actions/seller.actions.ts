"use server";
import { SellerProfile } from "../types/user.ts/sellerProfile";
import { CreateSellerProfileDto } from "../types/user.ts/sellerCreate";
import { Product } from "../types/product/Product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function becomeSeller(
  data: CreateSellerProfileDto,
  userId: string,
  accessToken?: string
): Promise<SellerProfile> {
  const response = await fetch(
    `${API_BASE_URL}/seller/upgrade/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
    `${API_BASE_URL}/seller/${sellerId}/products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  sellerId: string,
  token: string 
): Promise<SellerProfile> {

  const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`, {
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

export async function updateSellerProfile(
  sellerId: string,
  data: Partial<SellerProfile>,
  token: string
): Promise<SellerProfile> {
  const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update seller profile");
  }

  return await response.json();
}