"use server";
import { getAccessToken } from "../auth";

export async function getBundleRecommendation(query: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bundle/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error("Failed to fetch bundle recommendation");

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error("Bundle recommendation error:", error);
    return { success: false, data: null };
  }
}