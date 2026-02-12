"use client";

import Sidebar, { SidebarNavItem } from "@/components/common/Sidebar";
import { Store, DollarSign, BarChart3 } from "lucide-react";

const NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Payout Management",
    href: "/admin/payouts",
    icon: <DollarSign size={20} />,
  },
  {
    label: "Report Management",
    href: "/admin/reports",
    icon: <BarChart3 size={20} />,
  },
  { label: "Market Place", icon: <Store size={20} />, href: "/" },
];

export default function AdminSidebar() {
  return (
    <Sidebar
      brandName="AIVANA"
      brandSubtitle="ADMIN"
      navItems={NAV_ITEMS}
      bgColor="#262549"
      width="w-68"
    />
  );
}
