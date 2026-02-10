"use server";
import { getAccessToken } from "../auth";
import type { Report, ReportStatus } from "../types/report";

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

export async function getReportByOrderItemAction(orderItemId: number) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reports/order-item/${orderItemId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    try {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch report");
    } catch (e) {
      throw new Error("Failed to fetch report");
    }
  }

  const text = await res.text();
  if (!text || text.trim() === "" || text === "null") {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse report response:", text);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Admin Actions
// ────────────────────────────────────────────────────────────────────────────

export async function getAllReportsAction(): Promise<Report[]> {
  console.log('getAllReportsAction called');
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch reports");
  }

  return await res.json();
}

export async function getReportByIdAction(id: number): Promise<Report> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch report");
  }

  return await res.json();
}

export async function updateReportStatusAction(
  id: number,
  status: ReportStatus,
): Promise<Report> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update report status");
  }

  return await res.json();
}
