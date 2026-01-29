import { Calendar, Mail, Edit, ShoppingBag, Star, Package } from "lucide-react";
import BackgroundAivana from "@/components/common/BackgroundAivana";

const ProfilePage = () => {

  const mockUser = {
    username: "Apisara Chonprasit",
    bio: "ฉันยังไม่ได้เพิ่มประวัติส่วนตัว",
    joinDate: "มกราคม 2024",
    email: "apisara@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Apisara",
  };

  const mockStats = {
    purchasedCount: 12,
    reviewCount: 3,
  };

  return (
    <div className="relative max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-2 py-15">
      <BackgroundAivana />
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-28 h-28 rounded-full">
          <img
            src={mockUser.avatar}
            alt={mockUser.username}
            className="w-full h-full rounded-full bg-slate-800 object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {mockUser.username}
          </h1>
          <p className="text-slate-400 mb-3">{mockUser.bio}</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>เข้าร่วมเมื่อ {mockUser.joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{mockUser.email}</span>
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
          <div className="group relative bg-slate-800/40 hover:border-purple-500/50 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShoppingBag size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 transition">
                <ShoppingBag className="text-purple-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {mockStats.purchasedCount}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  ซื้อสินค้าแล้ว
                </p>
              </div>
            </div>
          </div>
          <div className="group relative bg-slate-800/40 hover:border-purple-500/50 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-white/5 group-hover:border-pink-500/30 transition">
                <Star className="text-pink-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {mockStats.reviewCount}
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
