// Helper functions for report severity calculation

export type SeverityLevel = "safe" | "low" | "warning" | "critical";

export interface SeverityInfo {
  level: SeverityLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Calculate severity level based on number of reports
 * ตรงกับ ReasonAutoHide threshold:
 * - 1-4   : ปกติ   🟢
 * - 5-9   : ต่ำ    🔵
 * - 10-14 : เตือน  🟡
 * - 15+   : วิกฤต  🔴
 */
export function calculateSeverity(reportCount: number): SeverityInfo {
  if (reportCount >= 15) {
    return {
      level: "critical",
      label: "วิกฤต",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.12)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    };
  }

  if (reportCount >= 10) {
    return {
      level: "warning",
      label: "เตือน",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.3)",
    };
  }

  if (reportCount >= 5) {
    return {
      level: "low",
      label: "ต่ำ",
      color: "#60a5fa",
      bgColor: "rgba(96, 165, 250, 0.12)",
      borderColor: "rgba(96, 165, 250, 0.3)",
    };
  }

  return {
    level: "safe",
    label: "ปกติ",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  };
}

/**
 * Check if product should show delete button
 * ปรับให้ตรงกับ threshold สูงสุด (อื่นๆ = 20)
 */
export function shouldShowDeleteButton(reportCount: number): boolean {
  return reportCount >= 20;
}
