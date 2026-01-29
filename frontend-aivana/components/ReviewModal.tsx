"use client";

import { X, Star } from "lucide-react";
import { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onSubmit?: (rating: number, message: string) => void;
  currentUser: any;
}

export default function ReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSubmit,
  currentUser,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("กรุณาให้คะแนน");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(rating, message);
      }

      setRating(0);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ข้อความของคุณ..."
              className="w-full h-32 p-4 bg-[#262549] rounded-2xl text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent"
            />
          </div>

          {/* Footer with Avatar and Submit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {currentUser.username
                      ? currentUser.username
                          .split(" ")
                          .map((n: any[]) => n[0])
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
