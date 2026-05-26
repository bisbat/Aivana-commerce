export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toDateParam(dateString: string): string {
  return dateString.split("T")[0];
}

export function formatBaht(value: number): string {
  return "฿" + value.toLocaleString("en-TH");
}
