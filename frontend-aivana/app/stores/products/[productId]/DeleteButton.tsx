"use client";

import { useState } from "react";
import { deleteProductAction } from "@/lib/actions/product.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) {
      showErrorToast("กรุณาระบุเหตุผลในการยกเลิกการขายสินค้า");
      return;
    }
    try {
      setIsDeleting(true);
      await deleteProductAction(productId, reason.trim());
      showSuccessToast("ยกเลิกการขายสินค้าเรียบร้อยแล้ว");
      router.push("/stores");
    } catch (err: any) {
      showErrorToast(err.message || "ไม่สามารถลบสินค้าได้");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium text-sm"
      >
        <Trash2 size={16} />
        ยกเลิกการขาย
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !isDeleting && setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#1e1b3d] border border-[#262549] rounded-3xl p-6 max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Icon + Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ยกเลิกการขายสินค้า
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                สินค้าจะหายจาก Marketplace แต่ผู้ที่ซื้อแล้วยังดาวน์โหลดได้
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-[#262549] rounded-xl p-4 mb-5">
              <div className="text-sm text-slate-400 mb-1">ชื่อสินค้า</div>
              <div className="text-white font-semibold">{productName}</div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-5">
              <p className="text-yellow-500 text-xs">
                ⚠️ เมื่อยกเลิกการขายแล้ว สินค้าจะไม่สามารถกลับมาขายได้อีก
              </p>
            </div>

            {/* Reason */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                เหตุผล <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="เช่น หยุดพัฒนาสินค้า, อัปเดตเวอร์ชันใหม่..."
                rows={3}
                disabled={isDeleting}
                className="w-full px-4 py-3 bg-[#262549] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#8a57fb] focus:ring-2 focus:ring-[#8a57fb]/20 transition-all resize-none disabled:opacity-50"
              />
              {!reason.trim() && (
                <p className="text-xs text-slate-500 mt-1">
                  เหตุผลนี้จะถูกบันทึกไว้สำหรับการตรวจสอบ
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-full border-2 border-[#262549] bg-transparent text-slate-300 font-medium hover:bg-[#2d2a52] transition-all duration-200 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-8 py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังดำเนินการ...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    ยืนยันยกเลิกการขาย
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
