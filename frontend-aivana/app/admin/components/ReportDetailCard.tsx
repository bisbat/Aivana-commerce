"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Report, ReportStatus } from "@/lib/types/report";
import { updateReportStatusAction } from "@/lib/actions/report.actions";
import { User, Package, FileText, MessageSquare } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

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

// ─── Format Date ────────────────────────────────────────────────────────────
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Format Price ───────────────────────────────────────────────────────────
function formatPrice(price: number) {
  return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ReportDetailCard({ report }: { report: Report }) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(
    report.status,
  );
  const [isUpdating, setIsUpdating] = useState(false);

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

        <div className="flex gap-4 items-start">
          {/* Product Image */}
          {report.orderItem.product.imageUrl && (
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img
                src={report.orderItem.product.imageUrl}
                alt={report.orderItem.product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Product Details */}
          <div className="flex-1">
            <p className="text-lg font-semibold text-white mb-3">
              {report.orderItem.product.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                label="ID สินค้า"
                value={`#${report.orderItem.product.id}`}
              />
              <InfoRow
                label="ราคา"
                value={formatPrice(report.orderItem.product.price)}
              />
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
          <p className="text-base text-white leading-relaxed">
            {report.reason}
          </p>
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
            { value: "rejected" as ReportStatus, label: "ไม่ผ่าน" },
            {
              value: "cancel_sale" as ReportStatus,
              label: "ยกเลิกการขายสินค้า",
            },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              disabled={isUpdating}
              className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                selectedStatus === option.value
                  ? "border-[#8a57fb] bg-[#8a57fb]/15 text-[#8a57fb]"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {option.label}
            </button>
          ))}
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

// ─── Info Row Component ─────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-base text-slate-200 font-medium">{value}</p>
    </div>
  );
}
