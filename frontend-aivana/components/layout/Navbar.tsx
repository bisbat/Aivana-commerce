"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { UserProfile } from "@/lib/types/user/user";
import { ProfileModal } from "./ProfileModal";
import { CartModal } from "../cart/CartModal";
import { getCurrentUser } from "@/lib/auth";
import { Tag } from "@/lib/types/tag";
import { getNavbarTagsAction } from "@/lib/actions/tag.actions";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>("all");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [tagNavbar, setTagNavbar] = useState<Tag[]>([]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setUser(user);
      setIsAuthenticated(!!user);
      setUserRole(user?.role || null);
      setUserId(user?.id || null);
      setUserData(user || null);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMoreCategories(false);
      }
    };

    if (isProfileOpen || showMoreCategories || isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, showMoreCategories, isCartOpen]); // เพิ่ม isCartOpen

  useEffect(() => {
    const loadNavbarTags = async () => {
      try {
        const tags = await getNavbarTagsAction();
        setTagNavbar(tags);
      } catch (err) {
        console.error("Failed to load navbar tags", err);
      }
    };

    loadNavbarTags();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleAiSearchClick = () => {
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        import("@/lib/toast").then(({ showErrorToast }) => {
          showErrorToast("กรุณาเข้าสู่ระบบก่อนจึงจะใช้ฟีเจอร์ AI ค้นหาได้");
        });
      }
      return;
    }
    router.push(`/ai-search`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTagClick = (tagName?: string) => {
    if (!tagName || tagName === "all") {
      setActiveTag("all");
      router.push("/");
    } else {
      setActiveTag(tagName);
      router.push(`/products?tag=${encodeURIComponent(tagName)}`);
    }
  };

  return (
    <nav className="relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-20 gap-5">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-3xl font-bold bg-gradient-to-br from-[#8a57fb] to-[#a78bfa] bg-clip-text text-transparent tracking-wide">
              AIVANA
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <div className="w-full relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-gray-400" size={20} />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="ค้นหาสินค้า..."
                  className="w-full pl-12 pr-28 py-3.5 rounded-xl text-white placeholder:text-slate-500 bg-[#1e1b3d] border border-[#262549] focus:outline-none focus:border-[#8a57fb] focus:ring-1 focus:ring-[#8a57fb] transition-all text-base"
                />

                <button
                  className="absolute right-2 px-4 py-1.5 text-sm font-semibold rounded-lg 
        bg-gradient-to-r from-purple-500 to-indigo-500 
        hover:from-purple-600 hover:to-indigo-600
        text-white transition-all shadow-md hover:shadow-lg"
                  onClick={() => {
                    handleAiSearchClick();
                  }}
                >
                  AI Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0 ml-auto">
            {isAuthenticated ? (
              <>
                <div ref={cartRef} className="relative">
                  {(userRole === "customer" || userRole === "seller") && (
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-[#eaeaea] hover:text-[#8a57fb] transition-colors relative"
                      aria-label="Cart"
                    >
                      <ShoppingCart size={22} />
                    </button>
                  )}
                </div>

                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="w-12 h-12 mx-auto mt-2 mb-4 rounded-full bg-[var(--background)] border-2 border-slate-500 hover:border-slate-400 flex items-center justify-center overflow-hidden transition-all cursor-pointer"
                  >
                    {userData?.avatarUrl ? (
                      <img
                        src={userData.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : userData?.username ? (
                      <span className="text-2xl font-bold text-slate-300">
                        {userData.username.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User size={40} className="text-slate-300" />
                    )}
                  </button>

                  <ProfileModal
                    user={userData}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    profileRef={profileRef}
                  />
                </div>

                {userRole === "customer" && (
                  <Link
                    href="/seller/become"
                    className="hidden sm:block px-6 py-2.5 rounded-xl bg-[#8a57fb] hover:bg-[#732ee2] text-white transition-colors font-medium text-base"
                  >
                    เริ่มขาย
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-[#eaeaea] hover:text-[#8a57fb] transition-colors text-sm font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:block px-5 py-2 rounded-lg bg-[#8a57fb] hover:bg-[#732ee2] text-white transition-colors text-sm font-medium"
                >
                  ลงทะเบียน
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-hide">
          <button
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTag === "all"
                ? "bg-[#8a57fb] text-white"
                : "bg-[#262549] text-gray-300 hover:bg-[#1e1b3d] hover:text-white"
            }`}
            onClick={() => handleTagClick("all")}
          >
            ทั้งหมด
          </button>

          {tagNavbar.slice(0, 10).map((tag) => (
            <button
              key={tag.id}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTag === tag.name
                  ? "bg-[#8a57fb] text-white"
                  : "bg-[#262549] text-gray-300 hover:bg-[#1e1b3d] hover:text-white"
              }`}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#1e1b3d] border-t border-[#262549]">
          <div className="px-4 py-4 space-y-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="ค้นหาสินค้า..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder:text-slate-500 bg-[#141332] border border-[#262549] focus:outline-none focus:border-[#8a57fb]"
              />
            </div>

            {isAuthenticated ? (
              <>
                {(userRole === "customer" || userRole === "seller") && (
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:text-[#8a57fb] transition-colors py-2 w-full text-left"
                  >
                    <ShoppingCart size={20} />
                    <span>ตะกร้า</span>
                  </button>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-3 text-white hover:text-[#8a57fb] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>โปรไฟล์</span>
                </Link>
                {userRole === "customer" && (
                  <Link
                    href="/seller/become"
                    className="block px-4 py-2 rounded-lg text-center font-medium bg-[#8a57fb] hover:bg-[#732ee2] text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    เริ่มขาย
                  </Link>
                )}
              </>
            ) : (
              <div className="pt-3 space-y-2 border-t border-[#262549]">
                <Link
                  href="/login"
                  className="block text-white hover:text-[#8a57fb] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 rounded-lg text-center font-medium bg-[#8a57fb] hover:bg-[#732ee2] text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ลงทะเบียน
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {isAuthenticated &&
        (userRole === "customer" || userRole === "seller") && (
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartRef={cartRef}
          />
        )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
