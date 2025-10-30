import React from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Package, DollarSign } from 'lucide-react';

// Define types for navigation items
interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

// Props interface - defines what data the Sidebar accepts
interface SidebarProps {
  storeName?: string;
  currentPath?: string; // Used to highlight active page
  onAddProductClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  storeName = "Store name",
  currentPath = '/',
  onAddProductClick
}) => {
  // Navigation items configuration
  const navItems: NavItem[] = [
    { label: 'Home', icon: <Home size={20} />, href: '/' },
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { label: 'Product', icon: <Package size={20} />, href: '/products' },
    { label: 'Earning', icon: <DollarSign size={20} />, href: '/earning' }
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 flex flex-col">
      {/* Store Header */}
      <h1 className="text-2xl font-bold mb-8">{storeName}</h1>
      
      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.href}
            {...item}
            isActive={currentPath === item.href}
          />
        ))}
      </nav>
      
      {/* Add Product Button */}
      <button 
        onClick={onAddProductClick}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
      >
        + Add Product
      </button>
    </aside>
  );
};

// Separate NavLink component for better organization
const NavLink: React.FC<NavItem> = ({ label, icon, href, isActive }) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-slate-800 text-white' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};