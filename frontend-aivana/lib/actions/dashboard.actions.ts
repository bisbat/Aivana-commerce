"use server";
import { getAccessToken } from "../auth";
import { SellerDashboard } from "../types/sellerDashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getDashboardStats(sellerId: string) {
  const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  const data = await response.json();

  return data;
}

export async function fetchSellerDashboard(): Promise<SellerDashboard> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE_URL}/seller/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseResponse<SellerDashboard>(res);
}
