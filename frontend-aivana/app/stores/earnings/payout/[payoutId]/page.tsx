import { fetchSellerRoundDetail } from "@/lib/actions/earning.actions";
import SellerRoundDetailTable from "@/components/seller/EarningRoundsDetailTable"
// ── Next.js 15: params is a Promise ──────────────────────────────────────────
export default async function PayoutDetailPage({
  params,
}: {
  params: Promise<{ payoutId: string }>;
}) {
  const { payoutId } = await params;

  let data = null;
  let error: string | null = null;

  try {
    data = await fetchSellerRoundDetail(payoutId);
  } catch (e) {
    error = (e as Error).message;
  }

  const formatPeriod = (s: string, e: string) => {
    const startDate = new Date(s);
    const endDate = new Date(e);
    return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString("th-TH", { month: "short" })}`;
  };

  return (
    <div style={{ maxWidth: 1200, padding: "32px 24px" }}>
      {/* Title */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
        รายการขายในรอบนี้
      </h1>

      {data && (
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
          ช่วงวันที่: {formatPeriod(data.periodStart, data.periodEnd)}
        </p>
      )}

      {/* Error */}
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
          Failed to load payout detail: {error}
        </div>
      )}

      {/* Table */}
      {data && <SellerRoundDetailTable data={data} />}
    </div>
  );
}