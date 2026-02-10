"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => router.back()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: `1px solid ${hovered ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.15)"}`,
        background: hovered ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)",
        color: hovered ? "#a78bfa" : "rgba(255,255,255,0.5)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        marginBottom: 24,
        transition: "all 0.2s ease",
      }}
    >
      ←
    </button>
  );
}