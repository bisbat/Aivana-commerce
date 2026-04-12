import { fetchPayoutRounds } from "@/lib/actions/payout.actions";
import type { PayoutRound } from "@/lib/types/admin/payout";
import PayoutRoundsTable from "../components/PayoutRoundsTable";
import { AlertCircle } from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";

// ─── Server Component — runs on the server, no "use client" ─────────────────
// This is where we fetch data. Next.js App Router lets us await directly here.
export default async function PayoutRoundsPage() {
  let rounds: PayoutRound[] = [];
  let error: string | null = null;

  try {
    rounds = await fetchPayoutRounds();
  } catch (e) {
    error = (e as Error).message;
  }

  // Pre-compute summary stats here on the server — no client JS needed
  const totalSellers = rounds.reduce((sum, r) => sum + r.sellerCount, 0);
  const totalPayout = rounds.reduce((sum, r) => sum + r.totalAmount, 0);
  const processingCount = rounds.filter(
    (r) => r.roundStatus === "processing",
  ).length;

  const stats = {
    totalSellers,
    totalPayout,
    processingCount,
    roundCount: rounds.length,
  };

  // Find the most recent round (first item after sort by periodStart desc)
  const currentRound =
    rounds.length > 0
      ? [...rounds].sort(
          (a, b) =>
            new Date(b.periodStart).getTime() -
            new Date(a.periodStart).getTime(),
        )[0]
      : null;

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">รอบโอนเงิน</h2>
          <p className="text-slate-400">
            รอบการจ่ายเงิน — จัดการรอบการชำระเงินของผู้ขาย
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load rounds: {error}</span>
          </div>
        )}

        {/* Summary stats + table — client component for interactivity */}
        <PayoutRoundsTable rounds={rounds} />
      </div>
    </div>
  );
}
