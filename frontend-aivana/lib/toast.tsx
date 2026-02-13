import toast from "react-hot-toast";
import React from "react";

export const showSuccessToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        style={{
          cursor: "pointer",
          userSelect: "none" as const,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 18px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "280px",
          background: "rgba(34, 197, 94, 0.15)",
          backdropFilter: "blur(12px)",
          color: "#ffffff",
          border: "1px solid rgba(34, 197, 94, 0.5)",
          boxShadow: "0 8px 32px rgba(34, 197, 94, 0.2)",
          opacity: t.visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <span style={{ fontSize: "16px" }}>✓</span>
        {message}
      </div>
    ),
    {
      position: "top-right",
      duration: 3000,
    },
  );
};

export const showErrorToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        style={{
          cursor: "pointer",
          userSelect: "none" as const,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 18px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "280px",
          background: "rgba(239, 68, 68, 0.15)",
          backdropFilter: "blur(12px)",
          color: "#ffffff",
          border: "1px solid rgba(239, 68, 68, 0.5)",
          boxShadow: "0 8px 32px rgba(239, 68, 68, 0.2)",
          opacity: t.visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <span style={{ fontSize: "16px" }}>✕</span>
        {message}
      </div>
    ),
    {
      position: "top-right",
      duration: 3000,
    },
  );
};
