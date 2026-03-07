"use server";

import { getAccessToken } from "../auth";
import type { ExtractedMetadata } from "@/lib/types/extracted-metadata";

type Category = "ui-kit" | "frontend-template" | "backend-template";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const METADATA_BASE = `${API_BASE_URL}/metadata-extraction`;


// ─── Shared error wrapper ───────────────────────────────────────────────────
async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}


// ─── POST /metadata-extraction/upload (multipart/form-data) ─────────────────
export async function extractMetadataFromUpload(
  category: Category,
  zipFile: File
): Promise<ExtractedMetadata> {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append("category", category);
  formData.append("file", zipFile);

  const res = await fetch(`${METADATA_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse<ExtractedMetadata>(res);
}


// ─── POST /metadata-extraction/url ──────────────────────────────────────────
export async function extractMetadataFromUrl(
  category: Category,
  fileUrl: string
): Promise<ExtractedMetadata> {
  const token = await getAccessToken();

  const res = await fetch(`${METADATA_BASE}/url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category,
      fileUrl,
    }),
  });

  return parseResponse<ExtractedMetadata>(res);
}