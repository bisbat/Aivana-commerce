import { fetchRoundDetail } from "@/lib/actions/payout.actions";
import { formatDate, formatBaht } from "@/lib/utils/formatPayout";
import RoundDetailTable from "@/app/admin/components/RoundDetailTable";
import BackButton from "@/app/admin/components/BackButton";

// ─── Server Component (Next.js 15 — params is now a Promise) ────────────────
export default async function RoundDetailPage({
  params,
}: {
  params: Promise<{ start: string; end: string }>; // ← Changed to Promise
}) {
  // ── CRITICAL: await params in Next.js 15 ──────────────────────────────────
  const { start, end } = await params;

  let roundData = null;
  let error: string | null = null;

  try {
    roundData = await fetchRoundDetail(start, end);
  } catch (e) {
    error = (e as Error).message;
  }

  const round = roundData?.round;
  const sellers = roundData?.sellers ?? [];

  // Format dates for display (start/end are already "YYYY-MM-DD")
  const displayStart = round ? formatDate(round.periodStart + "T00:00:00.000Z") : "";
  const displayEnd = round ? formatDate(round.periodEnd + "T00:00:00.000Z") : "";

  return (
    <div style={{ maxWidth: 960 }}>
      <BackButton />

      {/* ── Round info card ──────────────────────────────────────────────── */}
      {round && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30,33,46,0.95), rgba(20,22,32,0.98))",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 36,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left — title + period */}
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              รอบโอนเงินครั้งที่ 15
            </p>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
              ช่วงวันที่:{" "}
              <strong style={{ color: "#fff" }}>
                {displayStart} – {displayEnd}
              </strong>
            </p>
          </div>

          {/* Right — round totals */}
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              ยอดรวมทั้งของรอบ:{" "}
              <strong style={{ color: "#fff", fontSize: 15 }}>
                {formatBaht(round.totalAmount)}
              </strong>
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              จำนวนร้านค้า:{" "}
              <strong style={{ color: "#fff" }}>{round.sellerCount} ร้าน</strong>
            </p>
          </div>
        </div>
      )}

      {/* ── Error banner ─────────────────────────────────────────────────── */}
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
          Failed to load round detail: {error}
        </div>
      )}

      {/* ── Table title ──────────────────────────────────────────────────── */}
      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 18,
          letterSpacing: -0.3,
        }}
      >
        ตารางรอบโอนเงินของระบบ
      </h3>

      {/* ── Seller list table ─────────────────────────────────────────────── */}
      <RoundDetailTable payouts={sellers} />
    </div>
  );
}