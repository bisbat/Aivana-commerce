"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PayoutRound } from "@/lib/types/admin/payout";
import { formatDate, formatBaht } from "@/lib/utils/formatPayout";
import StatusBadge from "./StatusBagde";

// ─── Single "View Round" button with hover state ────────────────────────────
function ViewRoundButton({
  periodStart,
  periodEnd,
}: {
  periodStart: string;
  periodEnd: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    // 🔥 normalize to Asia/Bangkok date
    const startDate = start.toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });
    const endDate = end.toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });

    router.push(`/admin/payouts/${startDate}/${endDate}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-4.5 py-1.75 text-xs font-semibold text-violet-400 border border-violet-400/40 rounded-lg bg-transparent hover:bg-violet-500/18 transition-all duration-200"
    >
      ตรวจสอบรอบ
      <span className="text-sm transition-transform hover:translate-x-0.5">
        →
      </span>
    </button>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function PayoutRoundsTable({
  rounds,
}: {
  rounds: PayoutRound[];
}) {
  return (
    <div className="bg-white/2.5 border border-white/7 rounded-2xl overflow-hidden">
      {/* Table title */}
      <div className="px-5 py-4 border-b border-white/6">
        <h3 className="text-lg font-semibold text-white">
          ตารางรอบโอนเงินของระบบ
        </h3>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/6">
            {["ระยะเวลา", "จำนวนผู้ขาย", "ยอดรวม", "สถานะ", "การดำเนินการ"].map(
              (col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide"
                >
                  {col}
                </th>
              ),
            )}
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
        <div className="text-center py-12 px-5 text-white/30 text-sm">
          ไม่มีรอบโอนเงินในขณะนี้
        </div>
      )}
    </div>
  );
}

// ─── Single table row — isolated so each row manages its own hover state ─────
function RoundRow({ round, index }: { round: PayoutRound; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border-b border-white/5 transition-colors duration-150 ${
        hovered ? "bg-white/3" : "bg-transparent"
      }`}
      style={{
        animation: `fadeSlideIn 0.35s ease ${index * 0.07}s both`,
      }}
    >
      {/* Period */}
      <td className="px-5 py-4 text-sm text-slate-400">
        {formatDate(round.periodStart)}
        <span className="text-white/20 mx-1.5">–</span>
        {formatDate(round.periodEnd)}
      </td>

      {/* Seller count */}
      <td className="px-5 py-4 text-sm text-white/55">
        {round.sellerCount} <span className="text-white/25 text-xs">ร้าน</span>
      </td>

      {/* Total amount */}
      <td className="px-5 py-4 text-sm font-semibold text-slate-200">
        {formatBaht(round.totalAmount)}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={round.roundStatus} />
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <ViewRoundButton
          periodStart={round.periodStart}
          periodEnd={round.periodEnd}
        />
      </td>
    </tr>
  );
}
