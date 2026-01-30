"use client";

import Reacts from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, DollarSign, Store } from "lucide-react";
import { SellerProfile } from "@/lib/types/user/sellerProfile";
import { getSellerById } from "@/lib/actions/seller.actions";
import { Product } from "@/lib/types/product/product";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = "/" }) => {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => setSellerId(user?.sellerId ?? null));
  }, []);

  const [seller, setSeller] = useState<SellerProfile | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!sellerId) return;
      const profileData = await getSellerById(sellerId);
      setSeller(profileData);
    }
    fetchData();
  }, [sellerId]);

  const navItems: NavItem[] = [
    { label: "Market Place", icon: <Store size={20} />, href: "/" },
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    { label: "Product", icon: <Package size={20} />, href: "/stores" },
    { label: "Earning", icon: <DollarSign size={20} />, href: "/earning" },
  ];
  const handleAddProduct = () => {
    router.push("/stores/products/new");
  };

  return (
    <aside className="w-64 min-h-screen bg-[var(--linne-purple)] text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-5 text-center text-white">
        {seller?.storeName}
      </h1>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            isActive={currentPath === item.href}
          />
        ))}

        <button
          onClick={handleAddProduct}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          + Add Product
        </button>
      </nav>
    </aside>
  );
};

const NavLink: React.FC<NavItem> = ({ label, icon, href, isActive }) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:text-white hover:bg-[var(--linne-purple-hover)]`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
