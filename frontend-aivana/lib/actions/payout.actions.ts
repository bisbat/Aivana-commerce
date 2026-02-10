"use server";
import { getAccessToken } from "../auth";
import type { PayoutRound, RoundDetailResponse, PayoutDetail, PayoutDetailResponse } from "@/lib/types/admin/payout";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const PAYOUT_BASE = `${API_BASE_URL}/admin/payouts`;


// ─── Shared error wrapper ───────────────────────────────────────────────────
// Throws a readable error when the backend returns a non-2xx status
async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── GET /admin/payouts/rounds ──────────────────────────────────────────────
export async function fetchPayoutRounds(): Promise<PayoutRound[]> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYOUT_BASE}/rounds`,{
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
  } });
  return parseResponse<PayoutRound[]>(res);
}


// ─── GET /admin/payouts/rounds/:start/:end ──────────────────────────────────
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

// ─── GET /admin/payouts/:id ─────────────────────────────────────────────────
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

// ─── PATCH /admin/payouts/:id/mark-paid (multipart/form-data) ──────────────
export async function markPayoutAsPaid(
  id: number,
  slipFile: File
): Promise<PayoutDetail> {
  const token = await getAccessToken();
  const formData = new FormData();
  formData.append("slip", slipFile);

  const res = await fetch(`${PAYOUT_BASE}/${id}/mark-paid`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return parseResponse<PayoutDetail>(res);
}