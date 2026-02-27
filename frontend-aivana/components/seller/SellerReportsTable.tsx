"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Report } from "@/lib/types/report";
import {
  AlertCircle,
  Package,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { calculateSeverity } from "@/lib/utils/reportSeverity";

// ─── Types ─────────────────────────────────────────────────────────────────
interface GroupedReport {
  productId: number;
  productName: string;
  productImage?: string;
  reports: Report[];
  totalReports: number;
  pending: number;
  underReview: number;
  resolved: number;
  rejected: number;
  latestReportDate: string;
  isDeleted: boolean;
  isHidden: boolean; // ✅ เพิ่ม
  deletedAt?: string;
  deletionReason?: string;
}

// ─── Helper Functions ──────────────────────────────────────────────────────
function groupReportsByProduct(reports: Report[]): GroupedReport[] {
  const grouped = new Map<number, GroupedReport>();

  reports.forEach((report) => {
    if (!report.orderItem.product) return;

    const productId = report.orderItem.product.id;

    if (!grouped.has(productId)) {
      grouped.set(productId, {
        productId,
        productName: report.orderItem.product.name,
        productImage: report.orderItem.product.imageUrl,
        reports: [],
        totalReports: 0,
        pending: 0,
        underReview: 0,
        resolved: 0,
        rejected: 0,
        latestReportDate: report.createdAt,
        isDeleted: report.orderItem.product.isDeleted,
        isHidden: report.orderItem.product.isHidden ?? false, // ✅ เพิ่ม
        deletedAt: report.orderItem.product.deletedAt,
        deletionReason: report.orderItem.product.deletionReason,
      });
    }

    const group = grouped.get(productId)!;
    group.reports.push(report);
    group.totalReports++;

    if (report.status === "pending") group.pending++;
    else if (report.status === "under_review") group.underReview++;
    else if (report.status === "resolved") group.resolved++;
    else if (report.status === "rejected") group.rejected++;

    if (new Date(report.createdAt) > new Date(group.latestReportDate)) {
      group.latestReportDate = report.createdAt;
    }
  });

  return Array.from(grouped.values()).sort(
    (a, b) =>
      new Date(b.latestReportDate).getTime() -
      new Date(a.latestReportDate).getTime(),
  );
}

// ─── Severity Badge ─────────────────────────────────────────────────────────
function SeverityBadge({ reportCount }: { reportCount: number }) {
  const severity = calculateSeverity(reportCount);
  const Icon =
    severity.level === "critical"
      ? ShieldAlert
      : severity.level === "warning"
        ? AlertCircle
        : ShieldCheck;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: 8,
        background: severity.bgColor,
        border: `1px solid ${severity.borderColor}`,
        color: severity.color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <Icon size={14} />
      {severity.label}
    </div>
  );
}

// ─── View Detail Button ─────────────────────────────────────────────────────
function ViewDetailButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/stores/reports/product/${productId}`)}
      className={`px-4 py-2 rounded-lg border border-[#8a57fb]/40 text-[#8a57fb] text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
        hovered ? "bg-[#8a57fb]/10" : "bg-transparent"
      }`}
    >
      ดูรายงานทั้งหมด
      <span
        className="transition-transform duration-200"
        style={{ transform: hovered ? "translateX(2px)" : "translateX(0)" }}
      >
        →
      </span>
    </button>
  );
}

// ─── Product Status Badge ────────────────────────────────────────────────────
function ProductStatusBadge({
  isDeleted,
  isHidden,
}: {
  isDeleted: boolean;
  isHidden: boolean;
}) {
  if (isDeleted) {
    return (
      <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-500/40 bg-red-500/10 text-red-400 text-[10px] font-black">
        <AlertTriangle size={11} className="stroke-[3px]" /> ถูกลบ
      </span>
    );
  }

  if (isHidden) {
    return (
      <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded border border-orange-500/40 bg-orange-500/10 text-orange-400 text-[10px] font-black">
        <EyeOff size={11} className="stroke-[3px]" /> ถูกซ่อน
      </span>
    );
  }

  return null;
}

// ─── Grouped Report Row ──────────────────────────────────────────────────────
function GroupedReportRow({
  group,
  index,
}: {
  group: GroupedReport;
  index: number;
}) {
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
      {/* Product Info */}
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <ProductStatusBadge
              isDeleted={group.isDeleted}
              isHidden={group.isHidden}
            />
            <h4
              className={`font-semibold text-[15px] line-clamp-1 tracking-tight transition-colors ${
                group.isDeleted
                  ? "text-slate-500"
                  : group.isHidden
                    ? "text-slate-400"
                    : "text-white"
              }`}
            >
              {group.productName}
            </h4>
          </div>
        </div>
      </td>

      {/* จำนวนรายงาน */}
      <td className="px-6 py-4">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#a881fc]">
            {group.totalReports}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">ครั้ง</span>
        </div>
      </td>

      {/* Severity */}
      <td className="px-6 py-4">
        <SeverityBadge reportCount={group.totalReports} />
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-sm text-slate-400 font-medium">
        {formatDate(group.latestReportDate)}
      </td>

      {/* Action */}
      <td className="px-6 py-4">
        <ViewDetailButton productId={group.productId} />
      </td>
    </tr>
  );
}

// ─── Main Table Component ───────────────────────────────────────────────────
export default function SellerReportsTable({ reports }: { reports: Report[] }) {
  const groupedReports = useMemo(
    () => groupReportsByProduct(reports),
    [reports],
  );

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 bg-gradient-to-r from-transparent to-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              รายงานปัญหาสินค้าของคุณ
            </h3>
            <p className="text-xs text-slate-500">
              ตรวจสอบและจัดการข้อร้องเรียนจากลูกค้า
            </p>
          </div>
          <div className="text-sm text-slate-400">
            พบ{" "}
            <span className="text-[#8a57fb] font-semibold">
              {groupedReports.length}
            </span>{" "}
            สินค้าที่ถูกรายงาน
          </div>
        </div>
      </div>

      {groupedReports.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <div className="mb-4 inline-flex p-4 rounded-full bg-slate-800/50 text-slate-600">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">ไม่มีรายงานปัญหาในขณะนี้</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-white/[0.02]">
                {[
                  "สินค้า",
                  "จำนวนรายงาน",
                  "ระดับความรุนแรง",
                  "รายงานล่าสุด",
                  "การดำเนินการ",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-6 py-4 text-[13px] text-slate-400 font-semibold uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {groupedReports.map((group, idx) => (
                <GroupedReportRow
                  key={group.productId}
                  group={group}
                  index={idx}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
