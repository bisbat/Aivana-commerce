"use client";

import type { TopSellingProduct } from "@/lib/types/sellerDashboard";

function formatBaht(value: number): string {
  return "฿" + value.toLocaleString("th-TH");
}

interface Props {
  products: TopSellingProduct[];
}

export default function TopProductsTable({ products }: Props) {
  const HEADERS = ["อันดับ", "สินค้า", "จำนวนที่ขาย", "ยอดขาย"];

  return (
    <>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 18 }}>
        สินค้าขายดีที่สุด
      </h2>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
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
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map((product, idx) => (
              <tr
                key={product.productId}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  background: idx % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", width: 80 }}>
                  #{idx + 1}
                </td>

                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        📦
                      </div>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1e1e2e" }}>
                      {product.productName}
                    </span>
                  </div>
                </td>

                <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                  {product.totalSold} ชิ้น
                </td>

                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e1e2e" }}>
                  {formatBaht(product.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "52px 20px",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            ยังไม่มีสินค้าขายดี
          </div>
        )}
      </div>
    </>
  );
}