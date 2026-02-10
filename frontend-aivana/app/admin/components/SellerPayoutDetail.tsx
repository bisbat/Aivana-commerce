"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PayoutDetailResponse } from "@/lib/types/admin/payout";
import { formatDate, formatBaht } from "@/lib/utils/formatPayout";
import { markPayoutAsPaid } from "@/lib/actions/payout.actions";

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: "22px 24px",
};

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
          เลขบัญชี: {data.seller.accountNumber}
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
    <div style={{ ...cardStyle }}>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>ยอดที่ต้องจ่าย</p>
      <p style={{ fontSize: 26, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>
        {formatBaht(data.payout.amountDue)}
      </p>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>สถานะ</p>
      <p style={{ fontSize: 22, color: isPending ? "#fb923c" : "#4ade80", fontWeight: 600 }}>
        {data.payout.status}
      </p>
    </div>
  );
}

// ─── Order breakdown table ──────────────────────────────────────────────────
function OrderTable({ data }: { data: PayoutDetailResponse }) {
  const HEADERS = ["Order ID", "วันที่", "สินค้า", "ราคาขาย", "คอมมิสชั่น", "เงินที่ได้"];

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: "hidden", marginBottom: 28 }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>รายการที่ขายได้</h3>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {HEADERS.map((col) => (
              <th
                key={col}
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.orders.map((o, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "14px 20px", color: "#a78bfa", fontWeight: 600 }}>#{o.orderId}</td>
              <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.55)" }}>
                {formatDate(o.date)}
              </td>
              <td style={{ padding: "14px 20px", color: "#e2e8f0" }}>{o.productName}</td>
              <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>
                {formatBaht(o.price)}
              </td>
              <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>
                {formatBaht(o.commission)}
              </td>
              <td style={{ padding: "14px 20px", color: "#fff", fontWeight: 600 }}>
                {formatBaht(o.sellerEarn)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function SummaryBox({ data }: { data: PayoutDetailResponse }) {
  return (
    <div style={cardStyle}>
      <h4 style={{ fontSize: 14, color: "#fff", fontWeight: 600, marginBottom: 14 }}>สรุปยอด</h4>

      <Row label="ยอดขายรวม" value={formatBaht(data.summary.grossSales)} />
      <Row label="- ค่าคอมมิสชั่น" value={formatBaht(data.summary.totalCommission)} />

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "12px 0" }} />

      <Row
        label="ยอดโอนสุทธิ"
        value={formatBaht(data.summary.netTransfer)}
        bold
      />
    </div>
  );
}

function Row({ label, value, bold = false }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{label}</span>
      <span style={{ color: bold ? "#a78bfa" : "#e2e8f0", fontWeight: bold ? 700 : 500 }}>
        {value}
      </span>
    </div>
  );
}


// ─── Upload zone (right) ────────────────────────────────────────────────────
function UploadZone({ file, preview, onFileSelect }: any) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={cardStyle}>
      <h4 style={{ fontSize: 14, color: "#fff", fontWeight: 600, marginBottom: 12 }}>
        อัพโหลดหลักฐานการโอน
      </h4>

      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: "2px dashed rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: preview ? 10 : "30px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {preview ? (
          <img src={preview} style={{ maxHeight: 100, borderRadius: 8 }} />
        ) : (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            คลิกเพื่ออัพโหลดสลิป
          </p>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*,.pdf"
        onChange={(e) => onFileSelect(e.target.files?.[0])}
      />
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