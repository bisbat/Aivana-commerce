"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Report, ReportStatus } from "@/lib/types/report";
import { updateReportStatusAction } from "@/lib/actions/report.actions";
import {
  User,
  Package,
  FileText,
  MessageSquare,
  ShieldAlert,
  AlertCircle,
  Info,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

// ─── Reason Severity Config ─────────────────────────────────────────────────
const REASON_CONFIG: Record<
  string,
  {
    level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: "shield" | "alert" | "info";
  }
> = {
  มีเนื้อหาที่ไม่เหมาะสม: {
    level: "CRITICAL",
    label: "วิกฤต",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    icon: "shield",
  },
  ละเมิดลิขสิทธิ์: {
    level: "CRITICAL",
    label: "วิกฤต",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    icon: "shield",
  },
  "ไฟล์เสียหาย หรือไม่สามารถเปิดได้": {
    level: "HIGH",
    label: "สูง",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.35)",
    icon: "alert",
  },
  เนื้อหาไม่ตรงตามที่โฆษณา: {
    level: "MEDIUM",
    label: "ปานกลาง",
    color: "#eab308",
    bg: "rgba(234,179,8,0.12)",
    border: "rgba(234,179,8,0.35)",
    icon: "alert",
  },
  อื่นๆ: {
    level: "LOW",
    label: "ต่ำ",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.10)",
    border: "rgba(148,163,184,0.25)",
    icon: "info",
  },
};

// ─── Reason Severity Badge ───────────────────────────────────────────────────
function ReasonSeverityBadge({ reason }: { reason: string }) {
  const config = REASON_CONFIG[reason];
  if (!config) return null;

  const Icon =
    config.icon === "shield"
      ? ShieldAlert
      : config.icon === "alert"
        ? AlertCircle
        : Info;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 6,
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}

// ─── Product Status Banner ───────────────────────────────────────────────────
function ProductStatusBanner({
  isDeleted,
  isHidden,
}: {
  isDeleted: boolean;
  isHidden: boolean;
}) {
  if (isDeleted) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-semibold mb-4">
        <AlertTriangle size={16} />
        สินค้านี้ถูกลบออกจากระบบแล้ว
      </div>
    );
  }
  if (isHidden) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 text-sm font-semibold mb-4">
        <EyeOff size={16} />
        สินค้านี้ถูกซ่อนออกจาก Marketplace อยู่
      </div>
    );
  }
  return null;
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReportStatus }) {
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
    cancel_sale: {
      label: "ยกเลิกการขายสินค้า",
      bg: "rgba(139,92,246,0.12)",
      border: "rgba(139,92,246,0.3)",
      color: "#8b5cf6",
    },
  };

  const { label, bg, border, color } = config[status];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: 8,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

// ─── Format Helpers ──────────────────────────────────────────────────────────
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number) {
  return `฿${price.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ReportDetailCard({ report }: { report: Report }) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(
    report.status,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const product = report.orderItem.product;
  const isProductDeleted = product?.isDeleted ?? false;
  const isProductHidden = product?.isHidden ?? false;

  const handleUpdateStatus = async () => {
    if (selectedStatus === report.status) return;
    try {
      setIsUpdating(true);
      await updateReportStatusAction(report.id, selectedStatus);
      showSuccessToast("อัปเดตสถานะรายงานเรียบร้อยแล้ว");
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      showErrorToast("ไม่สามารถอัปเดตสถานะรายงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUpdating(false);
    }
  };

  // cancel_sale ไม่ควรกดได้ถ้าสินค้าถูกลบไปแล้ว
  const isOptionDisabled = (value: ReportStatus) =>
    value === "cancel_sale" && isProductDeleted;

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              รายงาน #{report.id}
            </h3>
            <p className="text-sm text-slate-400">
              รายงานเมื่อ: {formatDate(report.createdAt)}
            </p>
            <p className="text-sm text-slate-400">
              อัปเดตล่าสุด: {formatDate(report.updatedAt)}
            </p>
          </div>
          <StatusBadge status={report.status} />
        </div>
      </div>

      {/* Reporter Information */}
      <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-purple-400" />
          ข้อมูลผู้รายงาน
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="ชื่อผู้ใช้" value={report.reportedBy.username} />
          <InfoRow label="อีเมล" value={report.reportedBy.email} />
          <InfoRow
            label="ชื่อ-นามสกุล"
            value={`${report.reportedBy.firstName} ${report.reportedBy.lastName}`}
          />
        </div>
      </div>

      {/* Product Information */}
      <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package size={20} className="text-purple-400" />
          ข้อมูลสินค้าที่รายงาน
        </h4>

        {/* Product Status Banner */}
        <ProductStatusBanner
          isDeleted={isProductDeleted}
          isHidden={isProductHidden}
        />

        <div className="flex gap-4 items-start">
          {product?.imageUrl && (
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-lg font-semibold text-white mb-3">
              {product?.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow label="ID สินค้า" value={`#${product?.id}`} />
              <InfoRow label="ราคา" value={formatPrice(product?.price ?? 0)} />
            </div>
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={20} className="text-purple-400" />
          รายละเอียดการรายงาน
        </h4>

        <div className="mb-4">
          <p className="text-sm text-slate-400 mb-2">เหตุผล</p>
          <div className="flex items-center gap-3">
            <p className="text-base text-white leading-relaxed">
              {report.reason}
            </p>
            <ReasonSeverityBadge reason={report.reason} />
          </div>
        </div>

        {report.message && (
          <div>
            <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
              <MessageSquare size={16} />
              ข้อความเพิ่มเติม
            </p>
            <p className="text-sm text-slate-300 leading-relaxed p-4 bg-white/[0.02] rounded-xl border border-white/5">
              {report.message}
            </p>
          </div>
        )}
      </div>

      {/* Update Status */}
      <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">อัปเดตสถานะ</h4>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { value: "pending" as ReportStatus, label: "รอดำเนินการ" },
            { value: "under_review" as ReportStatus, label: "กำลังตรวจสอบ" },
            { value: "resolved" as ReportStatus, label: "แก้ไขแล้ว" },
            { value: "rejected" as ReportStatus, label: "ถูกปฏิเสธ" },
            {
              value: "cancel_sale" as ReportStatus,
              label: "ยกเลิกการขายสินค้า",
            },
          ].map((option) => {
            const disabled = isUpdating || isOptionDisabled(option.value);
            return (
              <button
                key={option.value}
                onClick={() => !disabled && setSelectedStatus(option.value)}
                disabled={disabled}
                className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                  selectedStatus === option.value
                    ? "border-[#8a57fb] bg-[#8a57fb]/15 text-[#8a57fb]"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
                } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleUpdateStatus}
          disabled={isUpdating || selectedStatus === report.status}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
            isUpdating || selectedStatus === report.status
              ? "bg-[#8a57fb]/30 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-[#8a57fb] to-[#732ee2] hover:from-[#732ee2] hover:to-[#8a57fb] cursor-pointer"
          }`}
        >
          {isUpdating ? "กำลังอัปเดต..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>
    </div>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-base text-slate-200 font-medium">{value}</p>
    </div>
  );
}
