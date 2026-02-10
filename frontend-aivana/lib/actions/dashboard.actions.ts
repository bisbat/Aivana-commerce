"use server";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
