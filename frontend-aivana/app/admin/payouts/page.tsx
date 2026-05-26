import { fetchPayoutRounds } from "@/lib/actions/payout.actions";
import type { PayoutRound } from "@/lib/types/admin/payout";
import PayoutRoundsTable from "../components/PayoutRoundsTable";
import { AlertCircle } from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";

export default async function PayoutRoundsPage() {
  let rounds: PayoutRound[] = [];
  let error: string | null = null;

  try {
    rounds = await fetchPayoutRounds();
  } catch (e) {
    error = (e as Error).message;
  }

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
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">รอบโอนเงิน</h2>
          <p className="text-slate-400">
            รอบการจ่ายเงิน — จัดการรอบการชำระเงินของผู้ขาย
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load rounds: {error}</span>
          </div>
        )}

        <PayoutRoundsTable rounds={rounds} />
      </div>
    </div>
  );
}
