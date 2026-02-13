"use client";

import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function ConfirmResponseModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-slate-800/80 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#8a57fb]/20 flex items-center justify-center mb-5 border-4 border-slate-700/50">
                <CheckCircle2 size={32} className="text-[#8a57fb]" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                ยืนยันการแก้ไขปัญหา
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                คุณต้องการแจ้งว่าได้แก้ไขปัญหาตามที่ลูกค้ารายงานเรียบร้อยแล้วใช่หรือไม่?
              </p>

              <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-white/10 mb-8">
                <p className="text-sm text-slate-300 font-medium">
                  "ผู้ขายได้ทำการแก้ไขตามที่แจ้งเรียบร้อยแล้ว"
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  ข้อความนี้จะถูกส่งไปยังผู้ดูแลระบบ
                </p>
              </div>

              <div className="flex justify-center gap-4 w-full">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-sm font-semibold bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-sm font-semibold bg-[#8a57fb] hover:bg-[#7145d9] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>กำลังส่ง...</>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      ยืนยัน
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
