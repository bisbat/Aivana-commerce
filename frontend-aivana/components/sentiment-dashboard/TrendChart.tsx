"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendData {
  week: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-white p-4">ไม่มีข้อมูลสำหรับแสดงกราฟ</div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-2xl border border-white/10">
      <h2 className="text-white text-lg font-semibold mb-4">
        Sentiment รายสัปดาห์
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="week" stroke="#ccc" />
            <YAxis stroke="#ccc" />

            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="positive"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#eab308"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="negative"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}