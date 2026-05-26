"use server";
import { getAccessToken } from "../auth";
import type { PayoutRound, RoundDetailResponse, PayoutDetail, PayoutDetailResponse } from "@/lib/types/admin/payout";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const PAYOUT_BASE = `${API_BASE_URL}/admin/payouts`;

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchPayoutRounds(): Promise<PayoutRound[]> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYOUT_BASE}/rounds`,{
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
  } });
  return parseResponse<PayoutRound[]>(res);
}

export async function fetchRoundDetail(
  start: string,
  end: string
): Promise<RoundDetailResponse> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYOUT_BASE}/rounds/${start}/${end}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse<RoundDetailResponse>(res);
}

export async function fetchPayoutById(id: number): Promise<PayoutDetail> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYOUT_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse<PayoutDetail>(res);
}


export async function fetchSellerPayoutDetail(
  id: string
): Promise<PayoutDetailResponse> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYOUT_BASE}/detail/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseResponse<PayoutDetailResponse>(res);
}

export async function markPayoutAsPaid(
  id: number,
  slipFile: File
): Promise<{ success: boolean; data?: PayoutDetail; message?: string }> {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append("slip", slipFile);

  const res = await fetch(`${PAYOUT_BASE}/${id}/mark-paid`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    let message = "เกิดข้อผิดพลาด";

    try {
      const json = await res.json();
      message = json?.message || json?.error || message;
    } catch {
      const text = await res.text();
      message = text || message;
    }

    return { success: false, message };
  }

  const data = await res.json();
  return { success: true, data };
}