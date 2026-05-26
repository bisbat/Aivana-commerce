import { fetchRoundDetail } from "@/lib/actions/payout.actions";
import { formatDate, formatBaht } from "@/lib/utils/formatPayout";
import BackButton from "@/app/admin/components/BackButton";
import BackgroundAivana from "@/components/common/BackgroundAivana";

export default async function RoundDetailPage({
  params,
}: {
  params: Promise<{ start: string; end: string }>;
}) {
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
  const displayStart = round
    ? formatDate(round.periodStart + "T00:00:00.000Z")
    : "";
  const displayEnd = round
    ? formatDate(round.periodEnd + "T00:00:00.000Z")
    : "";

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        <BackButton />
        {round && (
          <div
            style={{
              background: "linear-gradient(145deg, #1c1f2b, #141622)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 18,
              padding: "28px 32px",
              marginBottom: 40,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: 1,
                }}
              >
                PAYOUT PERIOD
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(139,92,246,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  🗓️
                </div>

                <strong
                  style={{ fontSize: 20, color: "#fff", fontWeight: 600 }}
                >
                  {displayStart} — {displayEnd}
                </strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: 40 }}>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: 4,
                  }}
                >
                  TOTAL PAYOUT
                </p>
                <p style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                  {formatBaht(round.totalAmount)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: 4,
                  }}
                >
                  SELLERS
                </p>
                <p style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                  {round.sellerCount}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      marginLeft: 6,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  ></span>
                </p>
              </div>
            </div>
          </div>
        )}
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
      </div>
    </div>
  );
}
