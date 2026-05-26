"use client";

import type { SellerRoundDetail } from "@/lib/types/sellerRoundDetail";

function formatBaht(value: number): string {
  return "฿" + value.toLocaleString("th-TH");
}

export default function SellerRoundDetailTable({ data }: { data: SellerRoundDetail }) {
  const HEADERS = ["สินค้า", "ราคาขาย", "ค่าธรรมเนียม", "เงินที่คุณได้รับ"];

  return (
    <>
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
            ยอดขายรวม
          </p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>
            {formatBaht(data.totalGrossSales)}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
            ค่าธรรมเนียมรวม
          </p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#fb923c" }}>
            {formatBaht(data.totalCommission)}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
            เงินสุทธิที่ได้รับ
          </p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#4ade80" }}>
            {formatBaht(data.totalNetAmount)}
          </p>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
              {HEADERS.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    letterSpacing: 0.3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.items.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  background: idx % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#1e1e2e", fontWeight: 500 }}>
                  {item.productName}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
                  {formatBaht(item.price)}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#fb923c" }}>
                  {formatBaht(item.commission)}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#4ade80" }}>
                  {formatBaht(item.sellerEarning)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "52px 20px",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            ไม่มีสินค้าในรอบนี้
          </div>
        )}
      </div>
    </>
  );
}