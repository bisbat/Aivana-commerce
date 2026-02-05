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
  const processingCount = rounds.filter((r) => r.roundStatus === "processing").length;

  const stats = { totalSellers, totalPayout, processingCount, roundCount: rounds.length };

  // Find the most recent round (first item after sort by periodStart desc)
  const currentRound =
    rounds.length > 0
      ? [...rounds].sort(
        (a, b) => new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime()
      )[0]
      : null;

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>
          รอบโอนเงิน
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
          Payout Rounds — manage seller payment cycles
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: "primary: rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            color: "#f87171",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          Failed to load rounds: {error}
        </div>
      )}


      {/* Summary stats + table — client component for interactivity */}
      <PayoutRoundsTable rounds={rounds} />
    </div>
  );
}
