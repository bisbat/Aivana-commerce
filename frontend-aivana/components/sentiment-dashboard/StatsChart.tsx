"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StatsChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

export default function StatsChart({
  positive,
  neutral,
  negative,
}: StatsChartProps) {
  const data = [
    { name: "บวก", value: positive },
    { name: "กลาง", value: neutral },
    { name: "ลบ", value: negative },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  const total = positive + neutral + negative;

  if (total === 0) {
    return (
      <div className="p-4 rounded-2xl text-white bg-slate-800/40 border border-white/5 ">
        ไม่มีข้อมูลสำหรับแสดง
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 ">
      <h2 className="text-white text-lg font-semibold mb-4">
        สัดส่วนความรู้สึกทั้งหมด
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}  
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{ backgroundColor: "#111", border: "none" }}
              labelStyle={{ color: "#fff" }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-white mt-2 text-sm opacity-70">
        ทั้งหมด {total.toLocaleString()} รีวิว
      </div>
    </div>
  );
}