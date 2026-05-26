"use server";
import { SellerProfile } from "../types/user/sellerProfile";
import { CreateSellerProfileDto } from "../types/user/sellerCreate";
import { Product } from "../types/product/Product";
import { getAccessToken } from "../auth";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function becomeSeller(
  data: CreateSellerProfileDto,
  userId: string,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(`${API_BASE_URL}/seller/upgrade/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to become seller");
  }

  const { accessToken } = await response.json();

  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: process.env.NODE_ENV === "production" ? "/capstone25/cp25ssi3" : "/",
  });

  return { success: true };
}

export async function getProductsBySellerId(
  sellerId: string,
): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/seller/${sellerId}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch products");
  }

  return await response.json();
}

export async function getSellerById(sellerId: string): Promise<SellerProfile> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update seller profile");
  }

  return await response.json();
}

export async function getSellerByUsername(
  username: string,
): Promise<SellerProfile> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/seller/username/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );


    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch seller by username");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
