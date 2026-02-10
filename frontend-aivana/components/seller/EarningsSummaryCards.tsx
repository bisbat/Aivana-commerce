"use client";

import type { SellerEarningsSummary } from "@/lib/types/earning";
import { formatBaht } from "@/lib/utils/formatPayout";

export default function EarningsSummaryCards({ summary }: { summary: SellerEarningsSummary }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
      {/* Card 1: เงินสุทธิที่ได้รับแล้ว (Paid) */}
      <div
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "24px 28px",
        }}
      >
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
          เงินสุทธิที่ได้รับแล้ว
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          เงินที่โอนให้แล้วเรียบร้อย
        </p>
        <p style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>
          {formatBaht(summary.paidAmount)} บาท
        </p>
      </div>

      {/* Card 2: เงินค้างจ่าย (Pending) */}
      <div
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "24px 28px",
        }}
      >
        <p style={{ fontSize: 14, color: "#a78bfa", marginBottom: 8, fontWeight: 600 }}>
          เงินค้างจ่าย
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          เงินที่รอรับจ่ายจากทักษัดไป
        </p>
        <p style={{ fontSize: 32, fontWeight: 800, color: "#a78bfa" }}>
          {formatBaht(summary.pendingAmount)} บาท
        </p>
      </div>
    </div>
  );
}