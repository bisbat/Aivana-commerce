"use client";

import { useState } from "react";
import type { Report, ReportStatus } from "@/lib/types/report";
import { User, MessageSquare, CheckCircle2, Clock, Lock } from "lucide-react";
import { addSellerResponseAction } from "@/lib/actions/report.actions";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

// ─── Status Badge Component ─────────────────────────────────────────────────
function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const config = {
    pending: {
      label: "รอดำเนินการ",
      bg: "rgba(251,191,36,0.12)",
      border: "rgba(251,191,36,0.3)",
      color: "#fbbf24",
    },
    under_review: {
      label: "กำลังตรวจสอบ",
      bg: "rgba(96,165,250,0.12)",
      border: "rgba(96,165,250,0.3)",
      color: "#60a5fa",
    },
    resolved: {
      label: "แก้ไขแล้ว",
      bg: "rgba(74,222,128,0.12)",
      border: "rgba(74,222,128,0.3)",
      color: "#4ade80",
    },
    rejected: {
      label: "ไม่ผ่านการตรวจสอบ",
      bg: "rgba(248,113,113,0.12)",
      border: "rgba(248,113,113,0.3)",
      color: "#f87171",
    },
    cancel_sale: {
      label: "ยกเลิกการขายสินค้า",
      bg: "rgba(107,114,128,0.12)",
      border: "rgba(107,114,128,0.3)",
      color: "#6b7280",
    },
  };

  const { label, bg, border, color } = config[status];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: 6,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

// ─── Single Report Row ──────────────────────────────────────────────────────
function ReportRow({ report, index }: { report: Report; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmResponse = async () => {
    setIsSubmitting(true);
    try {
      await addSellerResponseAction(report.id);
      showSuccessToast("แจ้งว่าแก้ไขเรียบร้อยแล้ว");
      router.refresh();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <tr
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`border-b border-white/5 transition-all duration-200 ${
          hovered ? "bg-white/5" : ""
        }`}
        style={{ animation: `fadeSlideIn 0.35s ease ${index * 0.05}s both` }}
      >
        {/* Report ID */}
        <td className="px-6 py-4">
          <div className="text-sm font-semibold text-[#8a57fb]">
            #{report.id}
          </div>
        </td>

        {/* Reporter */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center border border-white/10">
              <User size={14} className="text-slate-400" />
            </div>
            <div>
              <div className="text-sm text-slate-200">
                {report.reportedBy.firstName} {report.reportedBy.lastName}
              </div>
              <div className="text-xs text-slate-500">
                @{report.reportedBy.username}
              </div>
            </div>
          </div>
        </td>

        {/* Reason */}
        <td className="px-6 py-4">
          <div className="text-sm text-slate-300 font-medium mb-1">
            {report.reason}
          </div>
          {report.message && (
            <div className="flex items-start gap-2 mt-2 p-2 bg-slate-900/50 rounded-lg border border-white/5">
              <MessageSquare
                size={14}
                className="text-slate-400 mt-0.5 shrink-0"
              />
              <div className="text-xs text-slate-400 line-clamp-3">
                {report.message}
              </div>
            </div>
          )}
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <ReportStatusBadge status={report.status} />
        </td>

        {/* Created Date */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
            <Clock size={12} className="shrink-0" />
            {formatDate(report.createdAt)}
          </div>
        </td>

        {/* Action / Response */}
        <td className="px-6 py-4">
          {report.sellerRespondedAt ? (
            // ─── Case 1: ตอบกลับแล้ว (Responded) ───
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#8a57fb]/10 rounded-lg border border-[#8a57fb]/20 w-fit min-h-[34px]">
              <CheckCircle2 size={14} className="text-[#8a57fb] shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[11px] font-bold text-[#8a57fb] mb-0.5">
                  แจ้งแก้ไขเรียบร้อย
                </span>
                <span className="text-[10px] text-slate-500">
                  {formatDate(report.sellerRespondedAt)}
                </span>
              </div>
            </div>
          ) : report.status !== "resolved" && report.status !== "rejected" ? (
            // ─── Case 2: ปุ่มกดแจ้งแก้ไข (Action Button) ───
            <button
              onClick={handleConfirmResponse}
              disabled={isSubmitting}
              // ใช้ min-h-[34px] เพื่อล็อคความสูงขั้นต่ำให้เท่ากันทุกสถานะ
              className="group min-h-[34px] w-fit text-xs px-3 py-1.5 rounded-lg bg-[#8a57fb]/10 hover:bg-[#8a57fb]/20 border border-[#8a57fb]/30 text-[#8a57fb] font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span>แจ้งว่าแก้ไขแล้ว</span>
            </button>
          ) : (
            // ─── Case 3: ปิดโดยแอดมิน (Closed by Admin) ───
            // ปรับ style ให้ขนาดเท่ากับปุ่ม (px-3 py-1.5 text-xs) แต่เป็นสีเทา
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-white/5 w-fit min-h-[34px] select-none opacity-75">
              {/* ใส่ Icon (เช่น Lock หรือ Check) เพื่อให้ visual balance เท่ากับปุ่มอื่น */}
              <Lock size={13} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-400">
                ปิดโดยแอดมินแล้ว
              </span>
            </div>
          )}
        </td>
      </tr>
    </>
  );
}

// ─── Main Table Component ───────────────────────────────────────────────────
export default function ProductReportsTable({
  reports,
}: {
  reports: Report[];
}) {
  // สร้าง Config สำหรับหัวตาราง เพื่อกำหนดความกว้างแต่ละช่อง
  const tableHeaders = [
    { label: "ID", className: "w-[80px]" },
    { label: "รายงานโดย", className: "w-[200px]" },
    { label: "เหตุผล", className: "w-[35%]" },
    // ปรับตรงนี้: เพิ่มความกว้างให้สถานะ (เช่น w-[180px] หรือ w-[15%])
    { label: "สถานะ", className: "w-[150px]" },
    { label: "วันที่รายงาน", className: "w-[15%]" },
    { label: "การดำเนินการ", className: "w-auto" },
  ];
  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden">
      {/* Table title */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            รายงานทั้งหมดสำหรับสินค้านี้
          </h3>
          <div className="text-sm text-slate-400">
            <span className="text-[#8a57fb] font-semibold">
              {reports.length}
            </span>{" "}
            รายงาน
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-400">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
          <p>ไม่มีรายงาน</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {tableHeaders.map((col) => (
                  <th
                    key={col.label}
                    // เพิ่ม col.className เข้าไปเพื่อบังคับความกว้าง
                    className={`text-left px-6 py-4 text-sm text-slate-400 font-medium ${col.className}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <ReportRow key={report.id} report={report} index={idx} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
