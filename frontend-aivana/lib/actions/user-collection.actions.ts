"use server";

import { UserCollection } from "@/lib/types/userCollection";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getUserCollections(): Promise<UserCollection[]> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/user-collections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user collections");
  }
  return response.json();
}
