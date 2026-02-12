"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  calculateSeverity,
  shouldShowDeleteButton,
} from "@/lib/utils/reportSeverity";
import { deleteProductAction } from "@/lib/actions/product.actions";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface DeleteProductButtonProps {
  productId: number;
  productName: string;
  reportCount: number;
}

export default function DeleteProductButton({
  productId,
  productName,
  reportCount,
}: DeleteProductButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const severity = calculateSeverity(reportCount);
  const showButton = shouldShowDeleteButton(reportCount);

  if (!showButton && severity.level !== "critical") {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProductAction(productId.toString());
      showSuccessToast("ลบสินค้าสำเร็จ");

      router.push("/admin/reports");
      router.refresh();
    } catch (error: any) {
      showErrorToast("เกิดข้อผิดพลาดในการลบสินค้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowModal(true)}
        className={`px-5 py-2.5 rounded-lg border-2 border-red-500/50 text-red-500 font-semibold transition-all duration-200 flex items-center gap-2 ${
          hovered ? "bg-red-500/10 border-red-500" : "bg-transparent"
        }`}
      >
        <Trash2 size={18} />
        ลบสินค้า
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !isDeleting && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#1e1b3d] border border-[#262549] rounded-3xl p-6 max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ยืนยันการลบสินค้า
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?
              </p>
            </div>

            <div className="bg-[#262549] rounded-xl p-4 mb-5">
              <div className="text-sm text-slate-400 mb-1">ชื่อสินค้า</div>
              <div className="text-white font-semibold mb-3">{productName}</div>

              <div className="text-sm text-slate-400 mb-1">จำนวนรายงาน</div>
              <div className="text-red-500 font-bold text-lg">
                {reportCount} รายงาน
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-5">
              <p className="text-yellow-500 text-xs">
                ⚠️ การลบสินค้าจะไม่สามารถย้อนกลับได้
                และจะส่งผลต่อข้อมูลในระบบที่เกี่ยวข้องทั้งหมด
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
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
                    กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    ลบสินค้า
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
