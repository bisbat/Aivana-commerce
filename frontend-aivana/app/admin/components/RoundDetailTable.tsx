"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Payout } from "@/lib/types/admin/payout";
import { formatBaht } from "@/lib/utils/formatPayout";

// ─── Status dot + Thai label ────────────────────────────────────────────────
// Backend already returns Thai text: "รอโอน" or "โอนแล้ว"
function SellerStatusDot({ status }: { status: string }) {
  const isPending = status === "รอโอน";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isPending ? "#facc15" : "#4ade80",
          boxShadow: isPending
            ? "0 0 6px rgba(250,204,21,0.5)"
            : "0 0 6px rgba(74,222,128,0.4)",
          animation: isPending ? "pulse 1.8s infinite" : "none",
        }}
      />
      <span style={{ fontSize: 13, color: "#1e1e2e", fontWeight: 500 }}>
        {status}
      </span>
    </span>
  );
}

// ─── "ดูรายละเอียด" action link ────────────────────────────────────────────
function ViewDetailsLink({ payoutId }: { payoutId: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/admin/payouts/detail/${payoutId}`)}
      style={{
        background: "none",
        border: "none",
        color: hovered ? "#7c3aed" : "#6d28d9",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        textDecoration: hovered ? "underline" : "none",
        padding: 0,
        transition: "color 0.15s ease",
      }}
    >
      ดูรายละเอียด
    </button>
  );
}

// ─── Single table row ───────────────────────────────────────────────────────
function SellerRow({ payout, index }: { payout: Payout; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid #e5e7eb",
        background: hovered ? "#f3f4f6" : index % 2 === 0 ? "#fff" : "#fafafa",
        transition: "background 0.12s ease",
        animation: `fadeSlideIn 0.3s ease ${index * 0.06}s both`,
      }}
    >
      {/* Seller name */}
      <td style={{ padding: "12px 16px", fontSize: 13, color: "#1e1e2e", fontWeight: 500 }}>
        {payout.sellerName}
      </td>

      {/* Order count */}
      <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
        {payout.orderCount}
      </td>

      {/* Gross sales */}
      <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
        {formatBaht(payout.grossSales)}
      </td>

      {/* Net payout (เงินที่ต้องโอน) */}
      <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", fontWeight: 600 }}>
        {formatBaht(payout.netPayout)}
      </td>

      {/* Status */}
      <td style={{ padding: "12px 16px" }}>
        <SellerStatusDot status={payout.status} />
      </td>

      {/* Action */}
      <td style={{ padding: "12px 16px" }}>
        <ViewDetailsLink payoutId={payout.payoutId} />
      </td>
    </tr>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function RoundDetailTable({ payouts }: { payouts: Payout[] }) {
  const HEADERS = ["Seller", "จำนวนออเดอร์", "ยอดยาย", "เงินที่ต้องโอน", "สถานะ", "จัดการ"];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
            {HEADERS.map((col) => (
              <th
                key={col}
                style={{
                  padding: "11px 16px",
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6b7280",
                  letterSpacing: 0.3,
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {payouts.map((payout, idx) => (
            <SellerRow key={payout.payoutId} payout={payout} index={idx} />
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {payouts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "52px 20px",
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          No sellers found in this round.
        </div>
      )}
    </div>
  );
}