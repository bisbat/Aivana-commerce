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
    const text = await res.text();
    const error = new Error(text || `API error ${res.status}`) as Error & {
      status?: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json() as Promise<AiGeneratedProduct>;
}
