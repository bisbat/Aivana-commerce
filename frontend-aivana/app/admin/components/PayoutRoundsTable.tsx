"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PayoutRound } from "@/lib/types/admin/payout";
import { formatDate, toDateParam, formatBaht } from "@/lib/utils/formatPayout";
import StatusBadge from "./StatusBagde";


// ─── Single "View Round" button with hover state ────────────────────────────
function ViewRoundButton({ periodStart, periodEnd }: { periodStart: string; periodEnd: string }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    // 🔥 normalize to Asia/Bangkok date
    const startDate = start.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
    const endDate = end.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

    router.push(`/admin/payouts/${startDate}/${endDate}`);
  };


  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        padding: "7px 18px",
        borderRadius: 8,
        border: "1px solid rgba(139,92,246,0.4)",
        backgroundColor: hovered ? "rgba(139,92,246,0.18)" : "transparent",
        color: "#a78bfa",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      ตรวจสอบรอบ
      <span style={{ fontSize: 14, transition: "transform 0.2s", transform: hovered ? "translateX(2px)" : "translateX(0)" }}>
        →
      </span>
    </button>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function PayoutRoundsTable({
  rounds
}: {
  rounds: PayoutRound[];
}) {
  return (
    <>

      {/* Table card */}
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Table title */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            ตารางรอบโอนเงินของระบบ
          </h3>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Period", "Sellers", "Total Amount", "Status", "Action"].map((col) => (
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
            {rounds.map((round, idx) => (
              <RoundRow key={idx} round={round} index={idx} />
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {rounds.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "rgba(255,255,255,0.3)",
              fontSize: 14,
            }}
          >
            No payout rounds found.
          </div>
        )}
      </div>
    </>
  );
}

// ─── Single table row — isolated so each row manages its own hover state ─────
function RoundRow({ round, index }: { round: PayoutRound; index: number }) {
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
      {/* Period */}
      <td style={{ padding: "16px 20px", fontSize: 13, color: "#cbd5e1" }}>
        {formatDate(round.periodStart)}
        <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 6px" }}>–</span>
        {formatDate(round.periodEnd)}
      </td>

      {/* Seller count */}
      <td style={{ padding: "16px 20px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
        {round.sellerCount}{" "}
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>ร้าน</span>
      </td>

      {/* Total amount */}
      <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
        {formatBaht(round.totalAmount)}
      </td>

      {/* Status */}
      <td style={{ padding: "16px 20px" }}>
        <StatusBadge status={round.roundStatus} />
      </td>

      {/* Action */}
      <td style={{ padding: "16px 20px" }}>
        <ViewRoundButton periodStart={round.periodStart} periodEnd={round.periodEnd} />
      </td>
    </tr>
  );
}