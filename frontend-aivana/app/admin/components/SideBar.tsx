"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Payout Management", icon: "💳", href: "/admin/payouts" },
  { label: "Report Management", icon: "📊", href: "/admin/reports" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 230,
        minHeight: "100vh",
        background: "#0a0c12",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "36px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: 32, paddingLeft: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
          AIVANA
        </h1>
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          ADMIN
        </span>
      </div>

      {/* Nav links — active state driven by current URL */}
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              backgroundColor: isActive ? "rgba(139,92,246,0.12)" : "transparent",
              border: isActive
                ? "1px solid rgba(139,92,246,0.2)"
                : "1px solid transparent",
              color: isActive ? "#a78bfa" : "rgba(255,255,255,0.45)",
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              textDecoration: "none",
              transition: "all 0.18s ease",
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}