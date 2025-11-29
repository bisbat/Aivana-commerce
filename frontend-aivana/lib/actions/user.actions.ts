import { UserProfile } from "@/lib/types/user.ts/user";
import { getAuthData } from "./auth.actions";

export async function getUserByUserId(
  userId: string
): Promise<UserProfile | null> {
  const accessToken = getAuthData().accessToken;
  try {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
