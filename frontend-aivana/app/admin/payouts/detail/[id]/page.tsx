import { fetchSellerPayoutDetail } from "@/lib/actions/payout.actions";
import BackButton from "@/app/admin/components/BackButton";
import SellerPayoutDetail from "@/app/admin/components/SellerPayoutDetail";
import BackgroundAivana from "@/components/common/BackgroundAivana";

export default async function PayoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data = null;
  let error: string | null = null;

  try {
    data = await fetchSellerPayoutDetail(id);
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        <BackButton />

        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 24,
          }}
        >
          ข้อมูลผู้ขาย
        </h2>
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

        {data && <SellerPayoutDetail data={data} />}
      </div>
    </div>
  );
}
