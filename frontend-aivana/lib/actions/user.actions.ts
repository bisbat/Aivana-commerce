'use server'
import { UserProfile } from "@/lib/types/user.ts/user";

export async function getUserByUserId(
  userId: string,
  accessToken: string
): Promise<UserProfile> {
  const response = await fetch(`http://localhost:3001/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user");
  }

  return response.json();
}


