// Helper functions for report severity calculation

export type SeverityLevel = "safe" | "warning" | "critical";

export interface SeverityInfo {
  level: SeverityLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Calculate severity level based on number of reports
 * Simple rule:
 * - 1-4 reports: Safe (🟢)
 * - 5-9 reports: Warning (🟡)
 * - 10+ reports: Critical (🔴)
 */
export function calculateSeverity(reportCount: number): SeverityInfo {
  if (reportCount >= 10) {
    return {
      level: "critical",
      label: "วิกฤต",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.12)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    };
  }

  if (reportCount >= 5) {
    return {
      level: "warning",
      label: "เตือน",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.3)",
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
 */
export function shouldShowDeleteButton(reportCount: number): boolean {
  return reportCount >= 10;
}
