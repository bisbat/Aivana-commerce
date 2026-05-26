"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Report, ReportStatus } from "@/lib/types/report";
import { User, Clock, CheckCircle2 } from "lucide-react";

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
      label: "ถูกปฏิเสธ",
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

function ViewDetailButton({ reportId }: { reportId: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/admin/reports/${reportId}`)}
      className={`px-3 py-1.5 rounded-lg border border-[#8a57fb]/40 text-[#8a57fb] text-xs font-semibold transition-all duration-200 flex items-center gap-2 min-h-[34px] ${
        hovered ? "bg-[#8a57fb]/10" : "bg-transparent"
      }`}
    >
      จัดการ
      <span
        className="transition-transform duration-200"
        style={{ transform: hovered ? "translateX(2px)" : "translateX(0)" }}
      >
        →
      </span>
    </button>
  );
}

function ReportRow({ report, index }: { report: Report; index: number }) {
  const [hovered, setHovered] = useState(false);

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

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border-b border-white/5 transition-all duration-200 ${
        hovered ? "bg-white/[0.02]" : ""
      }`}
      style={{ animation: `fadeSlideIn 0.35s ease ${index * 0.05}s both` }}
    >
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-[#8a57fb]">#{report.id}</div>
      </td>
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
      <td className="px-6 py-4">
        <div className="text-sm text-slate-300 font-medium mb-1">
          {report.reason}
        </div>
      </td>
      <td className="px-6 py-4">
        <ReportStatusBadge status={report.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
          <Clock size={12} className="shrink-0" />
          {formatDate(report.createdAt)}
        </div>
      </td>
      <td className="px-6 py-4">
        {report.sellerRespondedAt ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8a57fb]/10 rounded-lg border border-[#8a57fb]/20 w-fit min-h-[34px]">
            <CheckCircle2 size={12} className="text-[#8a57fb] shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold text-[#8a57fb]">
                ผู้ขายแจ้งแก้ไขแล้ว
              </span>
              <span className="text-[9px] text-slate-500">
                {formatDate(report.sellerRespondedAt)}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-500 italic">
            ยังไม่มีการตอบกลับ
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <ViewDetailButton reportId={report.id} />
      </td>
    </tr>
  );
}

export default function ProductReportsTable({
  reports,
}: {
  reports: Report[];
}) {
  const tableHeaders = [
    { label: "ID", className: "w-[70px]" },
    { label: "ผู้รายงาน", className: "w-[180px]" },
    { label: "เหตุผล", className: "w-[30%]" },
    { label: "สถานะ", className: "w-[140px]" },
    { label: "วันที่รายงาน", className: "w-[150px]" },
    { label: "การตอบกลับ", className: "w-[180px]" },
    { label: "การดำเนินการ", className: "w-[100px]" },
  ];

  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            รายการรายงานทั้งหมด
          </h3>
          <div className="text-sm text-slate-400">
            <span className="text-[#8a57fb] font-semibold">
              {reports.length}
            </span>{" "}
            รายงาน
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {tableHeaders.map((header) => (
                <th
                  key={header.label}
                  className={`px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${header.className}`}
                >
                  {header.label}
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
    </div>
  );
}
