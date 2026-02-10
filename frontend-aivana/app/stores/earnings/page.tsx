import { fetchSellerEarningsSummary, fetchSellerEarningsRounds } from "@/lib/actions/earning.actions";
import EarningsSummaryCards from "@/components/seller/EarningsSummaryCards";
import EarningsRoundsTable from "@/components/seller/EarningsRoundsTable";
// ─── Server Component ────────────────────────────────────────────────────────
// You'll need to get sellerId from your auth context or params
export default async function SellerEarningsPage() {
  // TODO: Replace with actual seller ID from session/auth


  let summary = null;
  let rounds: any[] = [];
  let error: string | null = null;

  try {
    [summary, rounds] = await Promise.all([
      fetchSellerEarningsSummary(),
      fetchSellerEarningsRounds(),
    ]);
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div style={{ maxWidth: 1200, padding: "32px 24px" }}>
      {/* Page title */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 28 }}>
        ภาพรวมยอดขาย
      </h1>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            color: "#f87171",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          Failed to load earnings: {error}
        </div>
      )}

      {/* Summary cards */}
      {summary && <EarningsSummaryCards summary={summary} />}

      {/* Rounds table */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginTop: 40, marginBottom: 18 }}>
        การจ่ายเงินแต่ละรอบ
      </h2>
      <EarningsRoundsTable rounds={rounds} />
    </div>
  );
}