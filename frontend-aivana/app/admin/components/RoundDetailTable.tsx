"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Payout } from "@/lib/types/admin/payout";
import { formatBaht } from "@/lib/utils/formatPayout";

function SellerStatusDot({ status }: { status: string }) {
  const isPending = status === "รอโอน";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isPending ? "#facc15" : "#4ade80",
          boxShadow: isPending
            ? "0 0 8px rgba(250,204,21,0.6)"
            : "0 0 8px rgba(74,222,128,0.5)",
          animation: isPending ? "pulse 1.8s infinite" : "none",
        }}
      />
      <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
        {status}
      </span>
    </span>
  );
}

function ViewDetailsLink({ payoutId }: { payoutId: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/admin/payouts/detail/${payoutId}`)}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: "1px solid rgba(139,92,246,0.4)",
        backgroundColor: hovered ? "rgba(139,92,246,0.18)" : "transparent",
        color: "#a78bfa",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      ดูรายละเอียด →
    </button>
  );
}

function SellerRow({ payout, index }: { payout: Payout; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background 0.15s ease",
        animation: `fadeSlideIn 0.35s ease ${index * 0.07}s both`,
      }}
    >
      <td style={cellStyleStrong}>{payout.sellerName}</td>
      <td style={cellStyle}>{payout.orderCount}</td>
      <td style={cellStyle}>{formatBaht(payout.grossSales)}</td>
      <td style={cellStyleStrong}>{formatBaht(payout.netPayout)}</td>
      <td style={cellStyle}>
        <SellerStatusDot status={payout.status} />
      </td>
      <td style={cellStyle}>
        <ViewDetailsLink payoutId={payout.payoutId} />
      </td>
    </tr>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "16px 20px",
  fontSize: 13,
  color: "rgba(255,255,255,0.65)",
};

const cellStyleStrong: React.CSSProperties = {
  ...cellStyle,
  color: "#e2e8f0",
  fontWeight: 600,
};

export default function RoundDetailTable({ payouts }: { payouts: Payout[] }) {
  const HEADERS = [
    "Seller",
    "จำนวนออเดอร์",
    "ยอดขาย",
    "เงินที่ต้องโอน",
    "สถานะ",
    "จัดการ",
  ];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
          รายละเอียดผู้ขายในรอบนี้
        </h3>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {HEADERS.map((col) => (
              <th
                key={col}
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
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

      {payouts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "rgba(255,255,255,0.3)",
            fontSize: 14,
          }}
        >
          No sellers found in this round.
        </div>
      )}
    </div>
  );
}
