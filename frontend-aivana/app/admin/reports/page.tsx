import { getAllReportsAction } from "@/lib/actions/report.actions";
import type { Report } from "@/lib/types/report";
import ReportsTable from "../components/ReportsTable";
import { AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";

export default async function ReportsPage() {
  let reports: Report[] = [];
  let error: string | null = null;

  try {
    reports = await getAllReportsAction();
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

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">รายงานปัญหา</h2>
          <p className="text-slate-400">
            Report Management — จัดการรายงานปัญหาจากผู้ใช้
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load reports: {error}</span>
          </div>
        )}

        {/* Severity Legend */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 mb-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert size={15} className="text-[#8a57fb]" />
            เกณฑ์ระดับความรุนแรง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Safe */}
            <div className="bg-slate-900/50 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={15} className="text-green-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-green-400 mb-0.5">
                  ปกติ (Safe)
                </div>
                <div className="text-xs text-slate-400">1-4 รายงาน</div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-slate-900/50 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={15} className="text-yellow-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-yellow-400 mb-0.5">
                  เตือน (Warning)
                </div>
                <div className="text-xs text-slate-400">5-9 รายงาน</div>
              </div>
            </div>

            {/* Critical */}
            <div className="bg-slate-900/50 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert size={20} className="text-red-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-red-400 mb-0.5">
                  วิกฤต (Critical)
                </div>
                <div className="text-xs text-slate-400">10+ รายงาน</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports table */}
        <ReportsTable reports={reports} />
      </div>
    </div>
  );
}
