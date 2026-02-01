"use client";

import { Calendar, Mail, Edit, ShoppingBag, Star, Package } from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/actions/user.actions";
import { formatJoinDate } from "@/lib/utils/formatJoinDate";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ purchasedCount: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        const userStats = await getUserStats();

        setUser(currentUser);
        setStats(userStats);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="relative max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-2 py-15">
        <BackgroundAivana />
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-28 h-28 rounded-full bg-slate-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-2 py-15">
        <BackgroundAivana />
        <div className="text-center text-slate-400">ไม่พบข้อมูลผู้ใช้</div>
      </div>
    );
  }

  return (
    <div className="relative max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-2 py-15">
      <BackgroundAivana />
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-28 h-28 rounded-full">
          <img
            src={
              user.avatarUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="Profile Image"
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user.username}
          </h1>
          {/* FIXME: สร้างเพิ่ม field bio ในฐานข้อมูล user */}
          <p className="text-slate-400 mb-3">
            {user.bio || "ฉันยังไม่ได้เพิ่มประวัติส่วนตัว"}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>เข้าร่วมเมื่อ {formatJoinDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <button className="mt-3 px-5 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 border border-slate-600 text-sm">
          <Edit size={16} />
          <span>แก้ไขโปรไฟล์</span>
        </button>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="text-purple-400" /> กิจกรรมของฉัน
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <ShoppingBag size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                <ShoppingBag className="text-purple-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {stats.purchasedCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  ซื้อสินค้าแล้ว
                </p>
              </div>
            </div>
          </div>
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Star size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-white/5">
                <Star className="text-pink-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {stats.reviewCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  รีวิวที่ให้
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
