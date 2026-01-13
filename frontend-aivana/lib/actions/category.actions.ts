"use server";

import { Category } from "@/lib/types/category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fetch all categories
export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/category`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  return await response.json();
}

export async function createCategory(name: string, description: string, accessToken?: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create category: ${response.status}`);
  }

  return await response.json();
}
