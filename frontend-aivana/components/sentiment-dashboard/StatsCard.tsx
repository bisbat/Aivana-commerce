"use client";

interface StatsCardProps {
  title: string;
  value: number | null;
  type?: "total" | "positive" | "negative" | "neutral";
}

export default function StatsCard({ title, value, type = "total" }: StatsCardProps) {
  const colorMap = {
    total: "bg-gray-800 text-white",
    positive: "bg-green-500/20 text-green-400",
    negative: "bg-red-500/20 text-red-400",
    neutral: "bg-yellow-500/20 text-yellow-400",
  };

  const textColorMap = {
    total: "text-gray-300",
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-yellow-400",
  };

  return (
    <div
      className={`rounded-2xl p-4 shadow-md border border-white/10 ${colorMap[type]}`}
    >
      <div className={`text-sm ${textColorMap[type]} mb-2`}>
        {title}
      </div>

      <div className="text-2xl font-bold">
        {value !== null ? value.toLocaleString() : "-"}
      </div>
    </div>
  );
}