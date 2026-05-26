"use server";
import { revalidatePath } from "next/cache";
import { CreateProductTagsDTO } from "../types/tag";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createTagAction(
  tagData: CreateProductTagsDTO
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${API_BASE_URL}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tagData),
  });
  revalidatePath("/tags");
}

export async function getAllTagsAction() {
  const res = await fetch(`${API_BASE_URL}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export async function getNavbarTagsAction() {
  const res = await fetch(`${API_BASE_URL}/tags/navbar`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
