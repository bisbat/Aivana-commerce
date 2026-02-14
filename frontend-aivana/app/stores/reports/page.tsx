import { getSellerReportsAction } from "@/lib/actions/report.actions";
import type { Report } from "@/lib/types/report";
import SellerReportsTable from "@/components/seller/SellerReportsTable";
import { AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";

export default async function SellerReportsPage() {
  let reports: Report[] = [];
  let error: string | null = null;

  try {
    console.log("Fetching seller reports...");
    reports = await getSellerReportsAction();
  } catch (e) {
    error = (e as Error).message;
  }

  // Count unique products (with defensive check)
  const uniqueProducts = new Set(
    reports
      .map((r) => r.orderItem.product?.id)
      .filter((id): id is number => id !== undefined && id !== null),
  );
  const productCount = uniqueProducts.size;

  // Count deleted products
  const deletedProductIds = Array.from(
    new Set(
      reports
        .filter((r) => r.orderItem.product?.isDeleted)
        .map((r) => r.orderItem.product?.id)
        .filter((id): id is number => id !== undefined && id !== null),
    ),
  );

  return (
    <div
      className="relative mx-auto"
      style={{ maxWidth: 1400, padding: "32px 24px" }}
    >
      <div className="relative z-10">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            รายงานปัญหาสินค้า
          </h2>
          <p className="text-slate-400">
            ดูรายงานปัญหาที่ลูกค้ารายงานเกี่ยวกับสินค้าของคุณ
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load reports: {error}</span>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">รายงานทั้งหมด</div>
            <div className="text-3xl font-bold text-white">
              {reports.length}
            </div>
          </div>
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">
              สินค้าที่ถูกรายงาน
            </div>
            <div className="text-3xl font-bold text-[#8a57fb]">
              {productCount}
            </div>
          </div>
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">รอดำเนินการ</div>
            <div className="text-3xl font-bold text-yellow-400">
              {reports.filter((r) => r.status === "pending").length}
            </div>
          </div>
        </div>

        {/* Reports table */}
        <SellerReportsTable reports={reports} />
      </div>
    </div>
  );
}
