// ─── ISO date → "16 Jan 2026" ───────────────────────────────────────────────
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── ISO date → "2026-01-16" (used in URL params) ──────────────────────────
// FIXED: Just extract the date part, don't convert to full ISO string
export function toDateParam(dateString: string): string {
  return dateString.split("T")[0];
}

// ─── number → "฿425,000" ────────────────────────────────────────────────────
export function formatBaht(value: number): string {
  return "฿" + value.toLocaleString("en-TH");
}