"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/sentiment-dashboard/StatsCard";
import TrendChart from "@/components/sentiment-dashboard/TrendChart";
import StatsChart from "@/components/sentiment-dashboard/StatsChart";
import ReviewFeed from "@/components/sentiment-dashboard/ReviewFeed";
import { fetchSentimentStats } from "@/lib/actions/sentiment.actions";
import { fetchSentimentTrend } from "@/lib/actions/sentiment.actions";
import { fetchSentimentReviews } from "@/lib/actions/sentiment.actions";
import { getCurrentUser } from "@/lib/auth";
import { showErrorToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { SentimentStats } from "@/lib/types/sentiment/stats";
import { SentimentTrend } from "@/lib/types/sentiment/trend";
import { SentimentReview } from "@/lib/types/sentiment/reviews";

export default function SentimentDashboardPage() {
  const [stats, setStats] = useState<SentimentStats | null>(null);
  const [trendData, setTrendData] = useState<SentimentTrend[]>([]);
  const [reviews, setReviews] = useState<SentimentReview[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();

      if (!user) {
        showErrorToast("กรุณาเข้าสู่ระบบก่อน");
        router.push("/login");
        return;
      }

      if (!user.sellerId) {
        showErrorToast("บัญชีของคุณไม่มีสิทธิ์เข้าถึงแดชบอร์ดนี้");
        router.push("/");
        return;
      }

      try {
        const [data, trend, reviews] = await Promise.all([
          fetchSentimentStats(user.sellerId),
          fetchSentimentTrend(user.sellerId),
          fetchSentimentReviews(user.sellerId),
        ]);

        setStats(data);
        setTrendData(trend);
        setReviews(reviews);
      } catch (err) {
        showErrorToast("โหลดข้อมูลไม่สำเร็จ");
      }
    }

    loadData();
  }, [router]);

  if (!stats) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 1200, padding: "32px 24px" }}>
      <h1 className="text-2xl font-bold text-white mb-7">
        ภาพรวมความรู้สึกของลูกค้า
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="ทั้งหมด" value={stats.total} type="total" />
        <StatsCard title="บวก" value={stats.positive} type="positive" />
        <StatsCard title="ลบ" value={stats.negative} type="negative" />
        <StatsCard title="กลาง" value={stats.neutral} type="neutral" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <TrendChart data={trendData} />
        <StatsChart
          positive={stats.positive}
          neutral={stats.neutral}
          negative={stats.negative}
        />
      </div>
    </div>
  );
}
