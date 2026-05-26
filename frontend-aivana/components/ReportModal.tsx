"use client";

import { X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  existingReason?: string;
  existingMessage?: string;
  onSubmit?: (reason: string, message: string) => void;
}

const reportReasons = [
  "มีเนื้อหาที่ไม่เหมาะสม",
  "ละเมิดลิขสิทธิ์",
  "ไฟล์เสียหาย หรือไม่สามารถเปิดได้",
  "เนื้อหาไม่ตรงตามที่โฆษณา",
  "อื่นๆ",
];

export default function ReportModal({
  isOpen,
  onClose,
  productName,
  existingReason,
  existingMessage,
  onSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedReason(existingReason || "");
      setMessage(existingMessage || "");
    }
  }, [isOpen, existingReason, existingMessage]);

  if (!isOpen) return null;

  const hasChanged =
    selectedReason !== (existingReason || "") ||
    message.trim() !== (existingMessage || "");

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("กรุณาเลือกเหตุผล");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(selectedReason, message.trim() || "");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1e1b3d] border border-[#262549] rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="text-orange-500" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              รีพอร์ตสินค้า
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {productName}
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-white font-medium mb-3 text-sm">
              เลือกเหตุผลในการรีพอร์ต
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full p-2.5 rounded-lg text-left text-sm transition-all border-2 ${selectedReason === reason ? "font-semibold text-white" : "text-slate-300"}`}
                  style={
                    selectedReason === reason
                      ? reason === "มีเนื้อหาที่ไม่เหมาะสม" ||
                        reason === "ละเมิดลิขสิทธิ์"
                        ? {
                            background: "rgba(239,68,68,0.12)",
                            borderColor: "#ef4444",
                          }
                        : reason === "ไฟล์เสียหาย หรือไม่สามารถเปิดได้"
                          ? {
                              background: "rgba(249,115,22,0.12)",
                              borderColor: "#f97316",
                            }
                          : reason === "เนื้อหาไม่ตรงตามที่โฆษณา"
                            ? {
                                background: "rgba(234,179,8,0.12)",
                                borderColor: "#eab308",
                              }
                            : reason === "อื่นๆ"
                              ? {
                                  background: "rgba(100,116,139,0.15)", // สีเทาอ่อน
                                  borderColor: "#64748b",
                                }
                              : {}
                      : { background: "#262549", borderColor: "transparent" }
                  }
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-white font-medium mb-2 text-sm">
              รายละเอียดเพิ่มเติม (ถ้ามี)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="อธิบายปัญหาที่พบ..."
              className="w-full h-24 p-3 bg-[#262549] rounded-xl text-white text-sm placeholder:text-slate-500 resize-none border border-transparent focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason || !hasChanged}
              className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีพอร์ต"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
