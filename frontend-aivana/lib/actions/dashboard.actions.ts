"use server";
import { getAccessToken } from "../auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getDashboardStats(
  sellerId: string,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // (แนะนำสำหรับ dashboard)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  const data = await response.json(); // ✅ สำคัญมาก

  return data; // ✅ plain object
}
