"use client";

type RoundStatus = "processing" | "completed";
type SellerStatus = "PENDING" | "PAID";
type Status = RoundStatus | SellerStatus;

const CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; pulse: boolean }
> = {
  processing: {
    label: "กำลังดำเนินการ",
    bg: "rgba(139,92,246,0.15)",
    text: "#a78bfa",
    border: "rgba(139,92,246,0.3)",
    pulse: true,
  },
  completed: {
    label: "เสร็จสิ้น",
    bg: "rgba(34,197,94,0.12)",
    text: "#4ade80",
    border: "rgba(34,197,94,0.25)",
    pulse: false,
  },
  PENDING: {
    label: "Waiting Transfer",
    bg: "rgba(251,146,60,0.12)",
    text: "#fb923c",
    border: "rgba(251,146,60,0.3)",
    pulse: true,
  },
  PAID: {
    label: "Transferred",
    bg: "rgba(34,197,94,0.12)",
    text: "#4ade80",
    border: "rgba(34,197,94,0.25)",
    pulse: false,
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: cfg.text,
          animation: cfg.pulse ? "pulse 1.8s infinite" : "none",
        }}
      />
      {cfg.label}
    </span>
  );
}