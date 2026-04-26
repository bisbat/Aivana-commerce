"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SellerEarningsRound } from "@/lib/types/earning";

function formatBaht(value: number): string {
  return "฿" + value.toLocaleString("th-TH");
}

function formatPeriod(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const month = startDate.toLocaleDateString("th-TH", { month: "short" });
  
  return `${startDay}-${endDay} ${month}`;
}

function StatusBadge({ status }: { status: "paid" | "pending" }) {
  const isPaid = status === "paid";
  
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: isPaid ? "rgba(34,197,94,0.12)" : "rgba(251,146,60,0.12)",
        color: isPaid ? "#4ade80" : "#fb923c",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: isPaid ? "#4ade80" : "#fb923c",
        }}
      />
      {isPaid ? "จ่ายแล้ว" : "รอจ่าย"}
    </span>
  );
}

// ─── UPDATED: Navigate by payoutId instead of dates ─────────────────────────
function RoundRow({ round, index }: { round: SellerEarningsRound; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleRowClick = () => {
    router.push(`/stores/earnings/payout/${round.payoutId}`);
  };

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleRowClick}
      style={{
        borderBottom: "1px solid #e5e7eb",
        background: hovered ? "#f3f4f6" : index % 2 === 0 ? "#fff" : "#fafafa",
        transition: "background 0.12s ease",
        cursor: "pointer",
      }}
    >
      <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
        {formatPeriod(round.periodStart, round.periodEnd)}
      </td>

      <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
        {formatBaht(round.grossSales)}
      </td>

      <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
        {formatBaht(round.commission)}
      </td>

      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#1e1e2e" }}>
        {formatBaht(round.netAmount)}
      </td>

      <td style={{ padding: "14px 16px" }}>
        <StatusBadge status={round.status} />
      </td>

      <td 
        style={{ padding: "14px 16px", fontSize: 13, color: "#6366f1" }}
        onClick={(e) => e.stopPropagation()}
      >
        {round.slipUrl ? (
          <a
            href={round.slipUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            ดูสลิป
          </a>
        ) : (
          <span style={{ color: "rgba(0,0,0,0.3)" }}>-</span>
        )}
      </td>
    </tr>
  );
}

export default function EarningsRoundsTable({ rounds }: { rounds: SellerEarningsRound[] }) {
  const HEADERS = ["ช่วงวันที่", "ยอดขายรวม", "ค่าคอมมิชชั่น", "เงินสุทธิ", "สถานะ", "สลิป"];

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
                  padding: "12px 16px",
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
          {rounds.map((round, idx) => (
            <RoundRow key={round.payoutId} round={round} index={idx} />
          ))}
        </tbody>
      </table>

      {rounds.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "52px 20px",
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          ยังไม่มีข้อมูลการจ่ายเงิน
        </div>
      )}
    </div>
  );
}