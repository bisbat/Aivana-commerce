"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { ProfileModal } from "./ProfileModal";
import { CartModal } from "../cart/CartModal";
import { getAuthData } from "@/lib/actions/auth.actions";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    const authData = getAuthData();
    setIsAuthenticated(!!authData.accessToken && !!authData.user);
    setUserRole(authData.user?.role || null);
  }, [pathname]);

  // Show search bar only on product-related pages
  const showSearchBar = pathname?.startsWith("/products");

  // Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isProfileOpen || isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isSearchOpen]);

  return (
    <nav className="bg-[var(--background)] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Side: Logo + Menu Items */}
          <div className="flex items-center gap-8 shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-family text-2xl font-bold text-[var(--primary)]">
                AIVANA
              </span>
            </Link>

            {/* Desktop Navigation - Moved to left */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/categories"
                className="text-white hover:text-[var(--primary)] transition-colors text-sm"
              >
                หมวดหมู่
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-[var(--primary)] transition-colors text-sm"
              >
                เกี่ยวกับ
              </Link>
              {userRole === "customer" && (
                <Link
                  href="/seller/become"
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium"
                >
                  สมัครเป็นผู้ขาย
                </Link>
              )}
            </div>
          </div>

          {/* Middle: Animated Search Bar - Only show on product/category pages */}
          {showSearchBar && (
            <div ref={searchRef} className="hidden md:flex items-center flex-1">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isSearchOpen
                    ? "w-full bg-slate-800/50 rounded-lg px-3 py-2"
                    : "w-auto"
                }`}
              >
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-white hover:text-[var(--primary)] transition-colors shrink-0"
                >
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาสินค้า..."
                  className={`bg-transparent text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 ease-in-out ${
                    isSearchOpen
                      ? "w-full ml-2 opacity-100"
                      : "w-0 ml-0 opacity-0 pointer-events-none"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Right Side: Conditional based on auth status */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-[var(--primary)] transition-colors"
              >
                <ShoppingCart size={20} />
              </button>

              {/* Profile Icon with Modal */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-white hover:text-[var(--primary)] transition-colors"
                >
                  <User size={20} />
                </button>

                {/* Profile Modal */}
                <ProfileModal
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-[var(--primary)] transition-colors text-sm font-medium"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--linne-purple-hover)] border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/categories"
              className="block text-white hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              หมวดหมู่
            </Link>
            <Link
              href="/about"
              className="block text-white hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              เกี่ยวกับ
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-white hover:text-[var(--primary)] text-left w-full"
                >
                  ตะกร้า
                </button>
                <Link
                  href={`/seller/${getAuthData().user?.id ?? ""}`}
                  className="block text-white hover:text-[var(--primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  โปรไฟล์
                </Link>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-700 space-y-2">
                <Link
                  href="/login"
                  className="block text-white hover:text-[var(--primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="block text-white hover:text-[var(--primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ลงทะเบียน
                </Link>
                {userRole === "customer" && (
                  <Link
                    href="/seller/become"
                    className="block text-white hover:text-[var(--primary)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    สมัครเป็นผู้ขาย
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Modal - only for authenticated users */}
      {isAuthenticated && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </nav>
  );
};
