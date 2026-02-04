"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PayoutDetailResponse } from "@/lib/types/admin/payout";
import { formatDate, formatBaht } from "@/lib/utils/formatPayout";
import { markPayoutAsPaid } from "@/lib/actions/payout.actions";

// ─── Seller info card (left side) ───────────────────────────────────────────
function SellerInfoCard({ data }: { data: PayoutDetailResponse }) {
  const periodStart = formatDate(data.period.start);
  const periodEnd = formatDate(data.period.end);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "24px",
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "rgba(139,92,246,0.15)",
          border: "1px solid rgba(139,92,246,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}>👤</span>
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
          ชื่อผู้ขาย:{" "}
          <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>
            {data.seller.name}
          </span>
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          งวด:{" "}
          <strong style={{ color: "rgba(255,255,255,0.7)" }}>
            {periodStart} – {periodEnd}
          </strong>
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          บัญชีธนาคาร: {data.seller.bankName}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          เลขบัญชี: •••• {data.seller.accountNumber.slice(-4)}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          ชื่อบัญชี: {data.seller.accountName}
        </p>
      </div>
    </div>
  );
}

// ─── Amount + status card (right side) ──────────────────────────────────────
function AmountStatusCard({ data }: { data: PayoutDetailResponse }) {
  const isPending = data.payout.status === "รอโอน";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
        ยอดที่ต้องจ่าย:{" "}
        <strong style={{ fontSize: 22, color: "#a78bfa" }}>
          {formatBaht(data.payout.amountDue)} บาท
        </strong>
      </p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
        สถานะ:{" "}
        <strong style={{ color: isPending ? "#fb923c" : "#4ade80", fontSize: 16 }}>
          {data.payout.status}
        </strong>
      </p>
    </div>
  );
}

// ─── Order breakdown table ──────────────────────────────────────────────────
function OrderTable({ data }: { data: PayoutDetailResponse }) {
  const HEADERS = ["Order ID", "วันที่", "ชื่อสินค้า", "ราคาขาย", "คอมมิสชั่น", "เงินที่ seller ได้"];

  return (
    <>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 14 }}>
        รายการที่ขายได้
      </h3>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          marginBottom: 32,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
              {HEADERS.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "11px 16px",
                    textAlign: "left",
                    fontSize: 11,
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
            {data.orders.map((order, idx) => {
              const orderDate = formatDate(order.date);
              
              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    animation: `fadeSlideIn 0.3s ease ${idx * 0.06}s both`,
                  }}
                >
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>
                    #{order.orderId}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                    {orderDate}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#1e1e2e" }}>
                    {order.productName}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                    {formatBaht(order.price)}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                    {formatBaht(order.commission)}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e1e2e" }}>
                    {formatBaht(order.sellerEarn)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Summary box (left) ─────────────────────────────────────────────────────
function SummaryBox({ data }: { data: PayoutDetailResponse }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "24px",
      }}
    >
      <h4 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
        สรุปยอด
      </h4>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>ยอดขายรวม</span>
        <span style={{ fontSize: 13, color: "#a78bfa" }}>
          {formatBaht(data.summary.grossSales)}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>- ค่าคอมมิสชั่น</span>
        <span style={{ fontSize: 13, color: "#a78bfa" }}>
          {formatBaht(data.summary.totalCommission)}
        </span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: 12 }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>ยอดโอนสุทธิ</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>
          {formatBaht(data.summary.netTransfer)}
        </span>
      </div>
    </div>
  );
}

// ─── Upload zone (right) ────────────────────────────────────────────────────
function UploadZone({
  file,
  preview,
  onFileSelect,
}: {
  file: File | null;
  preview: string | null;
  onFileSelect: (f: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File | null) => {
      if (f) onFileSelect(f);
    },
    [onFileSelect]
  );

  return (
    <div>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 14 }}>
        อัพโหลดหลักฐานการโอน
      </h4>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0] ?? null);
        }}
        style={{
          border: `2px dashed ${dragging ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.15)"}`,
          borderRadius: 14,
          padding: preview ? "12px" : "36px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s ease",
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="slip preview"
            style={{
              maxHeight: 110,
              maxWidth: "100%",
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26, color: "rgba(255,255,255,0.25)" }}>↑</span>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              รองรับ jpg / png / pdf
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
          📎 {file.name}
        </p>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function SellerPayoutDetail({ data }: { data: PayoutDetailResponse }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPending = data.payout.status === "รอโอน";

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setError(null);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handleMarkPaid = async () => {
    if (!file) {
      setError("กรุณาอัพโหลดรูปรับงบ (slip) ก่อน");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await markPayoutAsPaid(data.payoutId, file);
      setSuccess(true);
      // Optionally refresh after 2s
      setTimeout(() => router.refresh(), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 36, marginBottom: 12 }}>✓</p>
        <p style={{ fontSize: 18, color: "#4ade80", fontWeight: 700 }}>
          โอนเงินสำเร็จ
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
          Payment slip uploaded & status updated
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Top row: Seller info + Amount/Status */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <div style={{ flex: "1 1 60%" }}>
          <SellerInfoCard data={data} />
        </div>
        <div style={{ flex: "1 1 40%" }}>
          <AmountStatusCard data={data} />
        </div>
      </div>

      {/* Order table */}
      <OrderTable data={data} />

      {/* Bottom row: Summary + Upload (only if PENDING) */}
      {isPending && (
        <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
          <div style={{ flex: "1 1 45%" }}>
            <SummaryBox data={data} />
          </div>
          <div style={{ flex: "1 1 55%" }}>
            <UploadZone file={file} preview={preview} onFileSelect={handleFileSelect} />
          </div>
        </div>
      )}

      {/* If PAID, show summary without upload */}
      {!isPending && (
        <div style={{ marginBottom: 28 }}>
          <SummaryBox data={data} />
        </div>
      )}

      {/* Mark as Paid button (only when PENDING) */}
      {isPending && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <button
            onClick={handleMarkPaid}
            disabled={loading}
            style={{
              padding: "11px 28px",
              borderRadius: 10,
              border: "none",
              background: loading ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.85)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {loading ? "กำลังบันทึก..." : "Mark as paid"}
          </button>

          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
            * หมายเหตุ: กรุณาตรวจสอบยอดจำนวนเงิน เลขบัญชี
            และหลักฐานการโอนให้ถูกต้องก่อนกดปุ่มนี้
            เมื่ออนุมัติแล้วจะไม่สามารถยกเว้นหรือเปลี่ยนแปลงได้
          </p>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div
          style={{
            marginTop: 16,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10,
            padding: "12px 18px",
            color: "#f87171",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}