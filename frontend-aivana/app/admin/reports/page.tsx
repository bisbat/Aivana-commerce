import { getAllReportsAction } from "@/lib/actions/report.actions";
import type { Report } from "@/lib/types/report";
import ReportsTable from "../components/ReportsTable";
import { AlertCircle, ShieldAlert, ShieldCheck, Info } from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";

export default async function ReportsPage() {
  let reports: Report[] = [];
  let error: string | null = null;

  try {
    reports = await getAllReportsAction();
  } catch (e) {
    error = (e as Error).message;
  }

  const uniqueProducts = new Set(
    reports
      .map((r) => r.orderItem.product?.id)
      .filter((id): id is number => id !== undefined && id !== null),
  );

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">รายงานปัญหา</h2>
          <p className="text-slate-400">
            Report Management — จัดการรายงานปัญหาจากผู้ใช้
          </p>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>Failed to load reports: {error}</span>
          </div>
        )}
        <div className="bg-white/2.5 border border-white/7 rounded-2xl p-5 mb-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert size={15} className="text-[#8a57fb]" />
            เกณฑ์ระดับความรุนแรง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white/2.5 border border-white/7 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={15} className="text-green-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-green-400 mb-0.5">
                  ปกติ
                </div>
                <div className="text-xs text-slate-400">1–4 รายงาน</div>
              </div>
            </div>
            <div className="bg-white/2.5 border border-white/7 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Info size={15} className="text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-400 mb-0.5">
                  ต่ำ
                </div>
                <div className="text-xs text-slate-400">5–9 รายงาน</div>
              </div>
            </div>
            <div className="bg-white/2.5 border border-white/7 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={15} className="text-yellow-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-yellow-400 mb-0.5">
                  เตือน
                </div>
                <div className="text-xs text-slate-400">10–14 รายงาน</div>
              </div>
            </div>
            <div className="bg-white/2.5 border border-white/7 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert size={15} className="text-red-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-red-400 mb-0.5">
                  วิกฤต
                </div>
                <div className="text-xs text-slate-400">15+ รายงาน</div>
              </div>
            </div>
          </div>
        </div>
        <ReportsTable reports={reports} />
      </div>
    </div>
  );
}
