"use client";

import { X, Star } from "lucide-react";
import { useState } from "react";
import { createReviewAction } from "../lib/actions/review.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onSubmit?: (rating: number, message: string) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("กรุณาให้คะแนน");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewAction(productId, {
        rating,
        comment: comment.trim() || undefined,
      });

      if (onSubmit) {
        await onSubmit(rating, comment);
      }

      showSuccessToast("ส่งรีวิวเรียบร้อยแล้ว!");

      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      showErrorToast("เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setRating(0);
      setComment("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1e1b3d] border border-[#262549] rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">รีวิวสินค้า</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {productName}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-200 hover:scale-110 focus:outline-none"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#262549] flex items-center justify-center hover:bg-[#2d2a52] transition-colors">
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-500"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Message Textarea */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ข้อความของคุณ..."
              className="w-full h-32 p-4 bg-[#262549] rounded-2xl text-white resize-none border border-transparent placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Footer with Avatar and Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="px-8 py-3 bg-[#8a57fb] hover:bg-[#7a47eb] cursor-pointer text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7a47eb]"
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
