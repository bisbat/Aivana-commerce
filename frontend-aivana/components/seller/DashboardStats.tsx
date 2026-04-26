"use client";

function formatBaht(value: number): string {
  return value.toLocaleString("th-TH");
}

interface Props {
  totalItemsSold: number;
  totalRevenue: number;
}

export default function DashboardStats({ totalItemsSold, totalRevenue }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
      {/* Card 1: จำนวนสินค้าที่ขายได้ */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "24px 28px",
          flex: 1,
        }}
      >
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
          จำนวนสินค้าที่ขายได้
        </p>
        <p style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>
          {totalItemsSold} ชิ้น
        </p>
      </div>

      {/* Card 2: ยอดขายสะสม */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "24px 28px",
          flex: 1,
        }}
      >
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
          ยอดขายสะสม
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          รายได้รวมตั้งแต่เปิดร้าน
        </p>
        <p style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>
          {formatBaht(totalRevenue)} บาท
        </p>
      </div>
    </div>
  );
}