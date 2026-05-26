"use server";

import type { SellerEarningsSummary, SellerEarningsRound } from "@/lib/types/earning";
import { getAccessToken } from "../auth";
import { SellerRoundDetail } from "../types/sellerRoundDetail";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchSellerEarningsSummary(): Promise<SellerEarningsSummary> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/seller/earnings/summary`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return parseResponse<SellerEarningsSummary>(res);
}

export async function fetchSellerEarningsRounds(
): Promise<SellerEarningsRound[]> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/seller/earnings/round`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseResponse<SellerEarningsRound[]>(res);
}

export async function fetchSellerRoundDetail(
  payoutId: string | number,
): Promise<SellerRoundDetail> {
  const token = await getAccessToken();
  const res = await fetch(
    `${BASE_URL}/seller/earnings/round/payout/${payoutId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  return parseResponse<SellerRoundDetail>(res);
}