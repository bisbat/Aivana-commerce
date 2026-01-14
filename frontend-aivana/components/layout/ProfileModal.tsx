"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Store, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth.server";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types/user.ts/user";

interface ProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUserData(user);
  }, [isOpen, router, onClose]);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute right-0 w-56 rounded-xl shadow-xl overflow-hidden bg-[#1e1b3d] border border-[#262549] z-50">
        <div className="p-3 border-b border-[#262549]">
          <p className="text-white font-medium text-sm">
            {userData?.username || "User"}
          </p>
          <p className="text-slate-400 text-xs mt-0.5"> {userData?.role}</p>
        </div>
        <div className="py-2">
          <Link
            className="block px-4 py-2 text-sm text-white hover:bg-[#262549] transition-colors"
            href={`/seller/${userData?.username ?? ""}`}
            onClick={onClose}
          >
            โปรไฟล์
          </Link>
          {userData?.role === "seller" && (
            <Link
              className="block px-4 py-2 text-sm text-white hover:bg-[#262549] transition-colors"
              href="/stores"
              onClick={onClose}
            >
              ร้านค้าของฉัน
            </Link>
          )}
          {/* <Link
        href="/orders"
        className="block px-4 py-2 text-sm text-white hover:bg-[#262549] transition-colors"
        onClick={() => setIsProfileOpen(false)}
      >
        คำสั่งซื้อของฉัน
      </Link> */}
        </div>
        <div className="py-2 border-t border-[#262549]">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#262549] transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </>
  );
};
