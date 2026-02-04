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

      {/* Current round info card — only shows when data exists */}
      {currentRound && (
        <CurrentRoundCard round={currentRound} />
      )}

      {/* Summary stats + table — client component for interactivity */}
      <PayoutRoundsTable rounds={rounds} stats={stats} />
    </div>
  );
}

// ─── Stateless sub-component (still server-rendered, no interactivity needed) ─
function CurrentRoundCard({ round }: { round: PayoutRound }) {
  const { formatDate } = require("@/lib/utils/formatPayout");

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(30,33,46,0.9), rgba(20,22,32,0.95))",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 14,
        padding: "22px 24px",
        marginBottom: 28,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", marginBottom: 6 }}>
        รอบโอนเงินปัจจุบันของระบบ
      </p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
        ช่วงวันที่:{" "}
        <strong style={{ color: "rgba(255,255,255,0.7)" }}>
          {formatDate(round.periodStart)} – {formatDate(round.periodEnd)}
        </strong>
      </p>
    </div>
  );
}