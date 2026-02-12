"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  brandName: string;
  brandSubtitle: string;
  navItems: SidebarNavItem[];
  bgColor?: string;
  width?: string;
  children?: React.ReactNode;
}

export default function Sidebar({
  brandName,
  brandSubtitle,
  navItems,
  bgColor = "#262549",
  width = "w-68",
  children,
}: SidebarProps) {
  const pathname = usePathname();
  const activeItem = navItems
  .filter((item) => pathname.startsWith(item.href))
  .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <nav
      className={`${width} min-h-screen border-r border-white/5 px-5 py-9 flex flex-col gap-2 shrink-0`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Brand */}
      <div className="mb-8 pl-3">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {brandName}
        </h1>
        <span className="text-base text-white/30 font-medium tracking-widest uppercase">
          {brandSubtitle}
        </span>
      </div>

      {/* Nav Items */}
      {navItems.map((item) => {
        // ── FIXED: Better active state logic 
        // ──────────────────────────────
        const isActive = activeItem?.href === item.href;


        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-180 ${
              isActive
                ? "bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold"
                : "border border-transparent text-white/45 font-medium hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <span className={isActive ? "text-violet-300" : "text-white/60"}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}

      {/* Additional children elements */}
      {children}
    </nav>
  );
}