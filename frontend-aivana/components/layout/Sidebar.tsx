'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ import router
import { Home, LayoutDashboard, Package, DollarSign } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  storeName?: string;
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  storeName = "Store name",
  currentPath = "/",
}) => {
  const router = useRouter(); // ✅ initialize router

  const navItems: NavItem[] = [
    { label: "Home", icon: <Home size={20} />, href: "/" },
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: "Product", icon: <Package size={20} />, href: "/products" },
    { label: "Earning", icon: <DollarSign size={20} />, href: "/earning" },
  ];

  // ✅ Function to handle navigation to /stores/products/new
  const handleAddProduct = () => {
    router.push("/stores/products/new");
  };

  return (
    <aside className="w-64 min-h-screen bg-[var(--linne-purple)] text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">{storeName}</h1>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            isActive={currentPath === item.href}
          />
        ))}

        {/* ✅ Add Product Button */}
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "text-white bg-[var(--linne-purple-hover-2)]"
          : "text-gray-300 hover:text-white hover:bg-[var(--linne-purple-hover)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
