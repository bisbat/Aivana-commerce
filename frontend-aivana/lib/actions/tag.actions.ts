"use server";
import { revalidatePath } from "next/cache";
import { CreateProductTagsDTO } from "../types/tag";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export async function createTagAction(
  tagData: CreateProductTagsDTO
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  // ส่งคำขอไปยัง API เพื่อสร้างแท็กใหม่
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
