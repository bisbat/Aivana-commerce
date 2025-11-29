"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Store, Settings, LogOut } from "lucide-react";
import {
  clearAuthData,
  getCurrentUserFromToken,
} from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  id: string;
  username: string;
  role: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Validate token first
      const currentUser = getCurrentUserFromToken();

      if (!currentUser) {
        // Token expired or invalid, clear data and redirect
        clearAuthData();
        onClose();
        router.push("/login");
        return;
      }

      if (currentUser) {
        setUserData({
          id: currentUser.sub,
          username: currentUser.username,
          role: currentUser.role,
        });
      } else {
        // If no user data, redirect to login
        onClose();
        router.push("/login");
      }
    }
  }, [isOpen, router, onClose]);

  const handleLogout = () => {
    clearAuthData();
    onClose();
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Click to close */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--linne-purple)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
        {/* Profile Section */}
        <div className="p-4 text-center border-slate-600">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[var(--background)] border-2 border-slate-500 flex items-center justify-center overflow-hidden">
            <User size={48} className="text-slate-300" />
          </div>

          {/* User Info */}
          <h3 className="text-xl font-bold text-white mb-1">
            {userData?.username || "User"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase">
            {userData?.role}
          </p>
        </div>

        {/* Navigation Menu */}

        <div>
          {/* โปรไฟล์ของฉัน */}
          <Link
            href={`/seller/${userData?.username ?? ""}`}
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 text-white hover:bg-slate-700 transition-colors"
          >
            <User size={20} />
            <span>โปรไฟล์ของฉัน</span>
          </Link>

          {/* ร้านของฉัน - แสดงเฉพาะ seller */}
          {userData?.role === "seller" && (
            <Link
              href="/stores"
              onClick={onClose}
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-slate-700 transition-colors"
            >
              <Store size={20} />
              <span>ร้านของฉัน</span>
            </Link>
          )}
          {/* 
          ตั้งค่า
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 text-white hover:bg-slate-700 transition-colors"
          >
            <Settings size={20} />
            <span>ตั้งค่า</span>
          </Link> */}
        </div>

        {/* Divider */}

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4a4668] rounded-xl font-medium transition-all"
          >
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </>
  );
};
