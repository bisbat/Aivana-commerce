"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Report, ReportStatus } from "@/lib/types/report";
import { AlertCircle, Package, ShieldAlert, ShieldCheck } from "lucide-react";
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
}

// ─── Helper Functions ──────────────────────────────────────────────────────
function groupReportsByProduct(reports: Report[]): GroupedReport[] {
  const grouped = new Map<number, GroupedReport>();

  reports.forEach((report) => {
    // Skip if product is missing (defensive)
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
      });
    }

    const group = grouped.get(productId)!;
    group.reports.push(report);
    group.totalReports++;

    // Count by status
    if (report.status === "pending") group.pending++;
    else if (report.status === "under_review") group.underReview++;
    else if (report.status === "resolved") group.resolved++;
    else if (report.status === "rejected") group.rejected++;

    // Update latest date
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

// ─── Severity Badge Component ─────────────────────────────────────────────────
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

// ─── Status Badge Component ─────────────────────────────────────────────────
function StatusCount({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-slate-400">
        {label}: <span className="text-slate-200 font-semibold">{count}</span>
      </span>
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
      onClick={() => router.push(`/admin/reports/product/${productId}`)}
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
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-medium text-slate-200">
              {group.productName}
            </div>
            <div className="text-xs text-slate-500">
              Product ID: #{group.productId}
            </div>
          </div>
        </div>
      </td>

      {/* Total Reports */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#8a57fb]">
            {group.totalReports}
          </span>
          <span className="text-xs text-slate-400">รายงาน</span>
        </div>
      </td>

      {/* Severity */}
      <td className="px-6 py-4">
        <SeverityBadge reportCount={group.totalReports} />
      </td>

      {/* Status Breakdown */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-3">
          <StatusCount count={group.pending} label="รอ" color="#fbbf24" />
          <StatusCount count={group.underReview} label="ตรวจ" color="#60a5fa" />
          <StatusCount count={group.resolved} label="แก้ไข" color="#4ade80" />
          <StatusCount
            count={group.rejected}
            label="ถูกปฏิเสธ"
            color="#f87171"
          />
        </div>
      </td>

      {/* Latest Report Date */}
      <td className="px-6 py-4 text-sm text-slate-400">
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
export default function ReportsTable({ reports }: { reports: Report[] }) {
  const groupedReports = useMemo(
    () => groupReportsByProduct(reports),
    [reports],
  );

  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden">
      {/* Table title */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            รายงานปัญหาแบบจัดกลุ่มตามสินค้า
          </h3>
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
        <div className="px-6 py-12 text-center text-slate-400">
          <p>ไม่มีรายงานปัญหา</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "สินค้า",
                  "จำนวนรายงาน",
                  "ระดับความรุนแรง",
                  "สถานะ",
                  "รายงานล่าสุด",
                  "การดำเนินการ",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-6 py-4 text-sm text-slate-400 font-medium"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
