"use client";

interface Review {
  id: string;
  text: string;
  sentimentLabel: "pos" | "neu" | "neg" | null;
  confidence: number | null;
  productName: string;
  analyzedAt: string | null;
}

interface ReviewFeedProps {
  reviews: Review[];
}

export default function ReviewFeed({ reviews }: ReviewFeedProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className=" p-4 rounded-2xl  text-white bg-slate-800/40 border border-white/5 ">
        ไม่มีความคิดเห็นสำหรับแสดง
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 mt-6">
      <h2 className="text-white text-lg font-semibold mb-4">
        ความคิดเห็นล่าสุด
      </h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const sentimentMap = {
    pos: {
      label: "บวก",
      color: "bg-green-500/20 text-green-400",
    },
    neu: {
      label: "กลาง",
      color: "bg-yellow-500/20 text-yellow-400",
    },
    neg: {
      label: "ลบ",
      color: "bg-red-500/20 text-red-400",
    },
  };

  const sentiment = review.sentimentLabel
    ? sentimentMap[review.sentimentLabel]
    : null;

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-400">
          {review.productName}
        </div>

        {sentiment && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${sentiment.color}`}
          >
            {sentiment.label}
          </span>
        )}
      </div>

      {/* Review text */}
      <p className="text-white text-sm mb-2 line-clamp-2">
        {review.text}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div>
          confidence:{" "}
          {review.confidence !== null
            ? (review.confidence * 100).toFixed(1) + "%"
            : "-"}
        </div>

        <div>
          {formatDate(review.analyzedAt)}
        </div>
      </div>
    </div>
  );
}

function formatDate(date: string | null) {
  if (!date) return "-";

  const d = new Date(date);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}