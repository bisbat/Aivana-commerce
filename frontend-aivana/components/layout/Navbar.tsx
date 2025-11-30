"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { ProfileModal } from "./ProfileModal";
import { CartModal } from "../cart/CartModal";
import { getCurrentUserFromToken } from "@/lib/actions/auth.actions";
import { getUserByUserId } from "@/lib/actions/user.actions";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUserFromToken();
      setIsAuthenticated(!!user);
      setUserRole(user?.role || null);
      setUserId(user?.id || null);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, [pathname]);

  const showSearchBar =
    pathname?.startsWith("/products") || pathname?.startsWith("/categories");

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

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-[var(--background)] border-b border-slate-800 sticky top-0 z-50">
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

            {/* Desktop Navigation */}
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
              {/* Show "Become Seller" button only if user is customer */}
              {userRole === "customer" && (
                <Link
                  href="/seller/become"
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium"
                >
                  สมัครเป็นผู้ขาย
                </Link>
              )}
              {/* Show "Dashboard" button if user is seller */}
            </div>
          </div>

          {/* Middle: Animated Search Bar */}
          {showSearchBar && (
            <div
              ref={searchRef}
              className="hidden md:flex items-center flex-1 max-w-2xl"
            >
              <form
                onSubmit={handleSearch}
                className={`flex items-center transition-all duration-300 ease-in-out w-full ${
                  isSearchOpen ? "bg-slate-800/50 rounded-lg px-3 py-2" : ""
                }`}
              >
                <button
                  type="button"
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
              </form>
            </div>
          )}

          {/* Right Side: Auth-based content */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {/* Cart - Show for customers and sellers */}
              {(userRole === "customer" || userRole === "seller") && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-white hover:text-[var(--primary)] transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} />
                </button>
              )}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-white hover:text-[var(--primary)] transition-colors"
                  aria-label="User profile"
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
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-[var(--primary)] transition-colors text-sm font-medium"
              >
                เข้าสู่ระบบ
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium"
              >
                ลงทะเบียน
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            {showSearchBar && (
              <form onSubmit={handleSearch} className="mb-3">
                <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาสินค้า..."
                    className="w-full ml-2 bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm"
                  />
                </div>
              </form>
            )}

            <Link
              href="/categories"
              className="block text-white hover:text-[var(--primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              หมวดหมู่
            </Link>
            <Link
              href="/about"
              className="block text-white hover:text-[var(--primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              เกี่ยวกับ
            </Link>

            {isAuthenticated ? (
              <>
                {(userRole === "customer" || userRole === "seller") && (
                  <>
                    <button
                      onClick={() => {
                        setIsCartOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-white hover:text-[var(--primary)] transition-colors text-left w-full"
                    >
                      ตะกร้า
                    </button>
                    <Link
                      href="/seller/become"
                      className="block text-white hover:text-[var(--primary)] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      สมัครเป็นผู้ขาย
                    </Link>
                  </>
                )}

                <Link
                  href="/profile"
                  className="block text-white hover:text-[var(--primary)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  โปรไฟล์
                </Link>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-700 space-y-2">
                <Link
                  href="/login"
                  className="block text-white hover:text-[var(--primary)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ลงทะเบียน
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Modal - Only for customers */}
      {isAuthenticated &&
        (userRole === "customer" || userRole === "seller") && (
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        )}
    </nav>
  );
};
