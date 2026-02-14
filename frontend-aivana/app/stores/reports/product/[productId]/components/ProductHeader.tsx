"use client";

import {
  ExternalLink,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { calculateSeverity } from "@/lib/utils/reportSeverity";
import Link from "next/link";

interface ProductHeaderProps {
  product: {
    id: number;
    name: string;
    imageUrl?: string;
    isDeleted: boolean;
    deletedAt?: string;
    deletionReason?: string;
  };
  reportCount: number;
  pendingCount: number;
  underReviewCount: number;
  resolvedCount: number;
  rejectedCount: number;
}

export default function ProductHeader({
  product,
  reportCount,
  pendingCount,
  underReviewCount,
  resolvedCount,
  rejectedCount,
}: ProductHeaderProps) {
  const severity = calculateSeverity(reportCount);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "ไม่ระบุวันที่";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Deleted Product Alert */}
      {product.isDeleted && (
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-500 mb-2">
                ⚠️ สินค้านี้ถูกลบโดยผู้ดูแลระบบ
              </h3>
              <div className="space-y-2 text-sm mb-3">
                <div>
                  <span className="text-slate-400">วันที่ลบ: </span>
                  <span className="text-white font-medium">
                    {formatDate(product.deletedAt)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">เหตุผล: </span>
                  <span className="text-white font-medium">
                    {product.deletionReason || "ไม่ได้ระบุเหตุผล"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-500 text-xs">
                  💡 <strong>หมายเหตุ:</strong>{" "}
                  รายงานทั้งหมดจะถูกเก็บไว้เพื่อเป็นประวัติ
                  หากต้องการขายสินค้าประเภทนี้อีกครั้ง
                  กรุณาปรับปรุงคุณภาพสินค้าให้ตรงตามมาตรฐานและอัปโหลดใหม่
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Link
                  href={`/products/${product.id}`}
                  className="group inline-flex items-center gap-2 mb-2"
                >
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#8a57fb] transition-colors">
                    {product.name}
                  </h2>
                  <ExternalLink
                    size={18}
                    className="text-slate-400 group-hover:text-[#8a57fb] transition-colors"
                  />
                </Link>
                <p className="text-slate-400 text-sm">
                  Product ID:{" "}
                  <span className="text-slate-300">#{product.id}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1.5">รวมทั้งหมด</div>
                <div className="text-3xl font-bold text-white tabular-nums">
                  {reportCount}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                <div className="text-xs text-yellow-400 mb-1">รอดำเนินการ</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {pendingCount}
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="text-xs text-blue-400 mb-1">กำลังตรวจสอบ</div>
                <div className="text-2xl font-bold text-blue-400">
                  {underReviewCount}
                </div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="text-xs text-green-400 mb-1">แก้ไขแล้ว</div>
                <div className="text-2xl font-bold text-green-400">
                  {resolvedCount}
                </div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <div className="text-xs text-red-400 mb-1">ไม่ผ่าน</div>
                <div className="text-2xl font-bold text-red-400">
                  {rejectedCount}
                </div>
              </div>
            </div>

            {/* Severity Level Badge */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <div className="text-sm text-slate-400">ระดับความรุนแรง:</div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: severity.bgColor,
                  border: `1px solid ${severity.borderColor}`,
                  color: severity.color,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {severity.level === "critical" ? (
                  <ShieldAlert size={15} className="text-red-500" />
                ) : severity.level === "warning" ? (
                  <AlertCircle size={15} className="text-yellow-500" />
                ) : (
                  <ShieldCheck size={15} className="text-green-500" />
                )}
                {severity.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
