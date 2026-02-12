import { fetchPayoutRounds } from "@/lib/actions/payout.actions";
import type { PayoutRound } from "@/lib/types/admin/payout";
import PayoutRoundsTable from "../components/PayoutRoundsTable";

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
    <div className="max-w-6xl">
      {/* Page title */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          รอบโอนเงิน
        </h2>
        <p className="text-sm text-white/35 mt-1">
          Payout Rounds — manage seller payment cycles
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          Failed to load rounds: {error}
        </div>
      )}

      {/* Summary stats + table — client component for interactivity */}
      <PayoutRoundsTable rounds={rounds} />
    </div>
  );
}
