"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Store,
  FileText,
} from "lucide-react";
import CommonSidebar, { SidebarNavItem } from "@/components/common/Sidebar";
import { SellerProfile } from "@/lib/types/user/sellerProfile";
import { getSellerById } from "@/lib/actions/seller.actions";
import { getCurrentUser } from "@/lib/auth";
import { getSellerReportsAction } from "@/lib/actions/report.actions";

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = "/" }) => {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [unviewedCount, setUnviewedCount] = useState(0);

  useEffect(() => {
    getCurrentUser().then((user) => setSellerId(user?.sellerId ?? null));
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!sellerId) return;
      const profileData = await getSellerById(sellerId);
      setSeller(profileData);
    }
    fetchData();
  }, [sellerId]);

  const navItems: SidebarNavItem[] = [
    { label: "Product", icon: <Package size={20} />, href: "/stores" },
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/stores/dashboard",
    },
    {
      label: "Earning",
      icon: <DollarSign size={20} />,
      href: "/stores/earnings",
    },
    {
      label: "Report",
      icon: <FileText size={20} />,
      href: "/stores/reports",
      badge: unviewedCount,
    },
    { label: "Marketplace", icon: <Store size={20} />, href: "/" },
  ];

  const handleAddProduct = () => {
    router.push("/stores/products/new");
  };

  return (
    <CommonSidebar
      brandName={seller?.storeName || "Loading..."}
      brandSubtitle=""
      navItems={navItems}
      bgColor="#262549"
      width="w-64"
      editStoreHref={
        seller?.user?.username
          ? `/seller/${seller.user.username}/edit`
          : undefined
      }
    >
      <button
        onClick={handleAddProduct}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mt-2"
      >
        + Add Product
      </button>
    </CommonSidebar>
  );
};
