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

export async function getUserStats() {
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

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
  },
  avatarFile?: File,
): Promise<UserProfile> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const formData = new FormData();

  if (data.username) formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.firstName) formData.append("firstName", data.firstName);
  if (data.lastName) formData.append("lastName", data.lastName);
  if (data.avatarUrl) formData.append("avatarUrl", data.avatarUrl);
  if (data.bio) formData.append("bio", data.bio);

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return response.json();
}
