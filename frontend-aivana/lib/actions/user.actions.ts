"use server";
import { UserProfile } from "@/lib/types/user/user";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getUserByUserId(userId: string): Promise<UserProfile> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
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

export async function getUserStats(id: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const collectionsResponse = await fetch(
      `${API_BASE_URL}/user-collections`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const collections = collectionsResponse.ok
      ? await collectionsResponse.json()
      : [];
    const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];

    return {
      purchasedCount: collections.length || 0,
      reviewCount: reviews.length || 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      purchasedCount: 0,
      reviewCount: 0,
    };
  }
}

export async function getUserByUsername(
  username: string,
): Promise<UserProfile | null> {
  try {
    const url = `${API_BASE_URL}/users/username/${username}`;
    console.log("Fetching user by username from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      console.error("Response not OK for username:", username);
      return null;
    }

    const data = await response.json();
    console.log("Successfully fetched user:", data?.username, data?.id);
    return data;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}
