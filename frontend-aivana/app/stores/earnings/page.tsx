import { fetchSellerEarningsSummary, fetchSellerEarningsRounds } from "@/lib/actions/earning.actions";
import EarningsSummaryCards from "@/components/seller/EarningsSummaryCards";
import EarningsRoundsTable from "@/components/seller/EarningsRoundsTable";
export default async function SellerEarningsPage() {

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
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 28 }}>
        ภาพรวมยอดขาย
      </h1>
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

      {summary ? (
        <EarningsSummaryCards summary={summary} />
      ) : (
        !error && (
          <div
            style={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: 16,
              padding: "24px",
              textAlign: "center",
              color: "#9ca3af",
              marginBottom: 24,
            }}
          >
            ยังไม่มีข้อมูลรายได้
          </div>
        )
      )}

      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#fff",
          marginTop: 40,
          marginBottom: 18,
        }}
      >
        การจ่ายเงินแต่ละรอบ
      </h2>

      {rounds.length === 0 ? (
        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: "32px",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            ยังไม่มีรอบการจ่ายเงิน
          </div>
          <div style={{ fontSize: 13 }}>
            ระบบจะสร้างรอบการจ่ายเงินทุกวันที่ 1 และ 16 ของเดือน
          </div>
        </div>
      ) : (
        <EarningsRoundsTable rounds={rounds} />
      )}

    </div>
  );
}