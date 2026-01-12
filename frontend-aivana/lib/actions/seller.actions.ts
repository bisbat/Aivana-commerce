"use server";
import { SellerProfile } from "../types/user.ts/sellerProfile";
import { CreateSellerProfileDto } from "../types/user.ts/sellerCreate";
import { Product } from "../types/product/Product";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function becomeSeller(
  data: CreateSellerProfileDto,
  userId: string,
): Promise<SellerProfile> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(
    `${API_BASE_URL}/seller/upgrade/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
): Promise<Product[]> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

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
): Promise<SellerProfile> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

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
): Promise<SellerProfile> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
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