'use server';
import { UserProfile } from "@/lib/types/user.ts/user";

export async function getUserByUserId(
  userId: string | null,
  accessToken: string | null
): Promise<UserProfile | null> {

  if (!userId) return null;
  if (!accessToken) return null;

  try {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

