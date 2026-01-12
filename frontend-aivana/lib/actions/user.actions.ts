'use server'
import { UserProfile } from "@/lib/types/user.ts/user";

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function getUserByUserId(
  userId: string,
  token: string
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user");
  }

  return response.json();
}


