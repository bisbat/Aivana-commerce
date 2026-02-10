"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Report, ReportStatus } from "@/lib/types/report";

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
      label: "ปฏิเสธ",
      bg: "rgba(248,113,113,0.12)",
      border: "rgba(248,113,113,0.3)",
      color: "#f87171",
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

// ─── View Detail Button ─────────────────────────────────────────────────────
function ViewDetailButton({ id }: { id: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/admin/reports/${id}`)}
      className={`px-4 py-2 rounded-lg border border-[#8a57fb]/40 text-[#8a57fb] text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
        hovered ? "bg-[#8a57fb]/10" : "bg-transparent"
      }`}
    >
      ดูรายละเอียด
      <span
        className="transition-transform duration-200"
        style={{ transform: hovered ? "translateX(2px)" : "translateX(0)" }}
      >
        →
      </span>
    </button>
  );
}

// ─── Single Report Row ──────────────────────────────────────────────────────
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
      {/* Report ID */}
      <td className="px-6 py-4 text-sm text-[#8a57fb] font-semibold">
        #{report.id}
      </td>

      {/* Product Name */}
      <td className="px-6 py-4 text-sm text-slate-200">
        {report.orderItem.product.name}
      </td>

      {/* Reporter */}
      <td className="px-6 py-4 text-sm text-slate-300">
        <div>{report.reportedBy.username}</div>
        <div className="text-xs text-slate-500 mt-1">
          {report.reportedBy.firstName} {report.reportedBy.lastName}
        </div>
      </td>

      {/* Reason */}
      <td className="px-6 py-4 text-sm text-slate-300">
        <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
          {report.reason}
        </div>
      </td>

      {/* Created At */}
      <td className="px-6 py-4 text-xs text-slate-400">
        {formatDate(report.createdAt)}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <ReportStatusBadge status={report.status} />
      </td>

      {/* Action */}
      <td className="px-6 py-4">
        <ViewDetailButton id={report.id} />
      </td>
    </tr>
  );
}

// ─── Main Table Component ───────────────────────────────────────────────────
export default function ReportsTable({ reports }: { reports: Report[] }) {
  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden">
      {/* Table title */}
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">
          รายการรายงานปัญหาทั้งหมด
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {[
                "ID",
                "สินค้า",
                "ผู้รายงาน",
                "เหตุผล",
                "วันที่",
                "สถานะ",
                "การดำเนินการ",
              ].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {col}
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

      {/* Empty state */}
      {reports.length === 0 && (
        <div className="text-center py-12 text-slate-400">ไม่พบรายงานปัญหา</div>
      )}

      {/* Add keyframes for animation */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
