"use server";

const API_BASE_URL =
  process.env.API_URL || "http://localhost:3001";

export async function getDashboardStats(
  sellerId: string,
  token: string
) {
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
