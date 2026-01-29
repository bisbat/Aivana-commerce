"use client";

import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onSubmit?: (reason: string, message: string) => void;
}

const reportReasons = [
  "เนื้อหาไม่ตรงตามที่โฆษณา",
  "ไฟล์เสียหาย หรือไม่สามารถเปิดได้",
  "มีเนื้อหาที่ไม่เหมาะสม",
  "ละเมิดลิขสิทธิ์",
  "อื่นๆ",
];

export default function ReportModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("กรุณาเลือกเหตุผล");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(selectedReason, message);
      }
      // Reset form
      setSelectedReason("");
      setMessage("");
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Report Product
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {productName}
            </p>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              เลือกเหตุผลในการรีพอร์ต
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedReason === reason
                      ? "bg-red-100 border-2 border-red-500 text-red-700 font-medium"
                      : "bg-gray-100 border-2 border-transparent hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              รายละเอียดเพิ่มเติม (ถ้ามี)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="อธิบายปัญหาที่พบ..."
              className="w-full h-32 p-4 bg-gray-100 rounded-2xl text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            />
          </div>

          {/* Footer with Avatar and Submit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">John Smith</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
            >
              {isSubmitting ? "กำลังส่ง..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
