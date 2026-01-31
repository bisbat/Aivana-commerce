"use server";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface CreateReportDTO {
  orderItemId: number;
  reason: string;
  message?: string | null;
}

export async function createOrUpdateReportAction(
  createReportDTO: CreateReportDTO,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(createReportDTO),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create or update report");
  }

  return await res.json();
}

export async function getMyReportsAction() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reports/my-reports`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch reports");
  }

  return await res.json();
}
