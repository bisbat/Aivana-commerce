import { getAllReportsAction } from "@/lib/actions/report.actions";
import type { Report } from "@/lib/types/report";
import ReportsTable from "../components/ReportsTable";
import {
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";

export default async function ReportsPage() {
  let reports: Report[] = [];
  let error: string | null = null;

  try {
    reports = await getAllReportsAction();
  } catch (e) {
    error = (e as Error).message;
  }

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const underReviewCount = reports.filter(
    (r) => r.status === "under_review",
  ).length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;

  return (
    <div className="relative mx-auto">
      <BackgroundAivana />
      <div className="relative z-10 max-w-[1400px]">
        {/* Page title */}
        <div className="mb-8">
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

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending */}
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Clock size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-white/5">
                <Clock className="text-yellow-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {pendingCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  รอดำเนินการ
                </p>
              </div>
            </div>
          </div>

          {/* Under Review */}
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <FileText size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/5">
                <FileText className="text-blue-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {underReviewCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  กำลังตรวจสอบ
                </p>
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <CheckCircle size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/5">
                <CheckCircle className="text-green-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {resolvedCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">แก้ไขแล้ว</p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <XCircle size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-white/5">
                <XCircle className="text-red-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {rejectedCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">ปฏิเสธ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />

        {/* Reports table */}
        <ReportsTable reports={reports} />
      </div>
    </div>
  );
}
