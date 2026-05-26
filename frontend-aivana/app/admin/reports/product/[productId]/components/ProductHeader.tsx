"use client";

import { Package, ExternalLink } from "lucide-react";
import { calculateSeverity } from "@/lib/utils/reportSeverity";
import DeleteProductButton from "./DeleteProductButton";
import Link from "next/link";

interface ProductHeaderProps {
  product: {
    id: number;
    name: string;
    imageUrl?: string;
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

  return (
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
              <div className="text-xs text-red-400 mb-1">ปฏิเสธ</div>
              <div className="text-2xl font-bold text-red-400">
                {rejectedCount}
              </div>
            </div>
          </div>
          {severity.level === "critical" && (
            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <div className="flex-1 text-sm text-red-400">
                ⚠️ สินค้านี้มีรายงานเกินเกณฑ์ ({reportCount} รายงาน) -
                พิจารณายกเลิกการขายสินค้า
              </div>
              <DeleteProductButton
                productId={product.id}
                productName={product.name}
                reportCount={reportCount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
