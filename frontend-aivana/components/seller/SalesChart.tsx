"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MonthlyPerformance } from "@/lib/types/sellerDashboard";

interface Props {
  data: MonthlyPerformance[];
}

export default function SalesChart({ data }: Props) {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    name: formatMonthThai(item.month),
    ยอดขาย: item.revenue,
    จำนวนสินค้า: item.itemsSold * 100, // Scale up for visibility
    จำนวนออเดอร์: item.ordersCount * 50,
  }));

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: 16,
        padding: "24px",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e1e2e" }}>
          Sales Performance
        </h3>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          {/* <span style={{ fontSize: 18, color: "#6b7280" }}>⚙️</span> */}
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="ยอดขาย" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatMonthThai(month: string): string {
  const [year, m] = month.split("-");
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return months[parseInt(m) - 1] || month;
}