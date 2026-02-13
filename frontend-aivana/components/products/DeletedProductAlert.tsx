"use client";

import { AlertTriangle, X } from "lucide-react";
import { Product } from "@/lib/types/product/product";

interface DeletedProductAlertProps {
  product: Product;
  onDismiss?: () => void;
}

export default function DeletedProductAlert({
  product,
  onDismiss,
}: DeletedProductAlertProps) {
  // Debug log
  console.log("DeletedProductAlert - Product:", {
    id: product.id,
    name: product.name,
    isDeleted: product.isDeleted,
    deletedAt: product.deletedAt,
    deletionReason: product.deletionReason,
  });

  if (!product.isDeleted) return null;

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
    <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 mb-6 relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={24} className="text-red-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            ⚠️ สินค้านี้ถูกลบโดยผู้ดูแลระบบ
          </h3>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-400">วันที่ลบ: </span>
              <span className="text-white font-medium">
                {formatDate(product.deletedAt)}
              </span>
            </div>

            {product.deletionReason && (
              <div>
                <span className="text-slate-400">เหตุผล: </span>
                <div className="mt-1 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <p className="text-slate-200 leading-relaxed">
                    {product.deletionReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-500 text-xs">
              💡 <strong>คำแนะนำ:</strong>{" "}
              หากคุณต้องการขายสินค้าประเภทนี้อีกครั้ง
              กรุณาปรับปรุงคุณภาพสินค้าให้ตรงตามมาตรฐานของเว็บไซต์
              และอัปโหลดสินค้าใหม่อีกครั้ง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
