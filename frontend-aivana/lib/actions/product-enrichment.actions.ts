"use server";

import { getAccessToken } from "../auth";
import type { ExtractedMetadata } from "@/lib/types/extracted-metadata";
import type { AiGeneratedProduct } from "@/lib/types/ai-generated-product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function enrichProduct(body: {
  metadata: ExtractedMetadata;
  sellerKeywords: string[];
  availableTags?: string[];
  availableCategories?: { id: number; name: string }[];
}): Promise<AiGeneratedProduct> {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE_URL}/product-enrichment/enrich`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const json = await res.json();
      message = json?.message || message;
    } catch {
      message = (await res.text()) || message;
    }
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  return res.json() as Promise<AiGeneratedProduct>;
}
