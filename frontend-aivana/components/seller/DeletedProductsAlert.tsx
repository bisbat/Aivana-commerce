"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeletedProductsAlertProps {
  deletedProductIds: number[];
  shouldShow: boolean;
  onDismiss: () => void;
}

export default function DeletedProductsAlert({
  deletedProductIds,
  shouldShow,
  onDismiss,
}: DeletedProductsAlertProps) {
  if (!shouldShow || deletedProductIds.length === 0) return null;

  return (
    <div
      className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-6 flex items-center gap-3 relative animate-in fade-in slide-in-from-top-2 duration-300"
      role="alert"
    >
      <AlertTriangle size={20} className="text-red-400 shrink-0" />
      <div className="flex-1">
        <p className="text-red-400 text-sm font-semibold">
          มีสินค้าที่ถูกลบโดย Admin จำนวน {deletedProductIds.length} รายการ
        </p>
        <p className="text-red-400/80 text-xs mt-1">
          สินค้าที่ถูกลบจะมีเครื่องหมาย "ถูกลบโดย Admin" ในตารางรายงานด้านล่าง
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 p-1 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
        aria-label="ปิดการแจ้งเตือน"
      >
        <X size={18} />
      </button>
    </div>
  );
}
