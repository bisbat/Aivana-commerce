"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface SidebarProps {
  brandName: string;
  brandSubtitle: string;
  navItems: SidebarNavItem[];
  bgColor?: string;
  width?: string;
  children?: React.ReactNode;
  editStoreHref?: string;
}

export default function Sidebar({
  brandName,
  brandSubtitle,
  navItems,
  bgColor = "#262549",
  width = "w-68",
  children,
  editStoreHref,
}: SidebarProps) {
  const pathname = usePathname();
  const activeItem = navItems
    .filter((item) => pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <nav
      className={`${width} min-h-screen border-r border-white/5 px-5 py-9 flex flex-col gap-2 shrink-0  z-20`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="mb-8 pl-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {brandName}
          </h1>
          {editStoreHref && (
            <Link
              href={editStoreHref}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Edit Store"
            >
              <Pencil size={18} />
            </Link>
          )}
        </div>
        <span className="text-base text-white/30 font-medium tracking-widest uppercase">
          {brandSubtitle}
        </span>
      </div>

      {navItems.map((item) => {
        const isActive = activeItem?.href === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-180 relative ${
              isActive
                ? "bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold"
                : "border border-transparent text-white/45 font-medium hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <span className={isActive ? "text-violet-300" : "text-white/60"}>
              {item.icon}
            </span>
            <span className="text-sm flex-1">{item.label}</span>
          </Link>
        );
      })}
      {children}
    </nav>
  );
}
