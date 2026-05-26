"use client";

import { Product } from "@/lib/types/product/Product";
import { SellerProfile } from "@/lib/types/user/sellerProfile";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import EditProfileButton from "@/components/common/EditProfileButton";
import { ProductGrid } from "@/components/home/ProductGrid";
import {
  Package,
  ShoppingBag,
  Star,
  MessageCircle,
  Calendar,
  Mail,
  Edit,
  Link2,
  Award,
  TrendingUp,
} from "lucide-react";
import { formatJoinDate } from "@/lib/utils/formatJoinDate";

type Props = {
  seller: SellerProfile;
  products: Product[];
  productsTotal: number;
  currentUserId?: string;
};

export default function SellerProfilePage({
  seller,
  products,
  productsTotal,
  currentUserId,
}: Props) {

  return (
    <div className="relative max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-2 py-15">
      <BackgroundAivana />

      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-28 h-28 rounded-full">
          {seller.user.avatarUrl ? (
            <img
              src={seller.user.avatarUrl}
              alt={seller.storeName}
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <span className="flex items-center justify-center w-28 h-28 rounded-full bg-slate-700 text-5xl font-bold text-white select-none">
              {seller.storeName?.charAt(0).toUpperCase() || "S"}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {seller.storeName}
          </h1>
          <p className="text-slate-400 mb-3">
            {seller.user.firstName} {seller.user.lastName} • @
            {seller.user.username}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>เข้าร่วมเมื่อ {formatJoinDate(seller.user.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{seller.user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2 bg-[#8a57fb]/90 hover:bg-[#8a57fb] text-white rounded-lg transition-colors flex items-center gap-2 border border-[#8a57fb] text-sm"
          >
            <MessageCircle size={16} />
            <span>ติดต่อร้านค้า</span>
          </button>
          {currentUserId && currentUserId === seller.user.id && (
            <EditProfileButton
              editPath={`/profile/edit`}
            />
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="text-purple-400" /> สถิติร้านค้า
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Package size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                <Package className="text-purple-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {productsTotal}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  สินค้าทั้งหมด
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <ShoppingBag size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/5">
                <ShoppingBag className="text-green-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {seller.totalSales}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  ยอดขายทั้งหมด
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Star size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-white/5">
                <Star className="text-yellow-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {seller.averageRating}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  คะแนนเฉลี่ย
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <MessageCircle size={64} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-white/5">
                <MessageCircle className="text-pink-400" size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {seller.totalReviews}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  รีวิวทั้งหมด
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Edit className="text-purple-400" size={20} /> เกี่ยวกับร้านค้า
        </h2>
        <p className="text-slate-300 leading-relaxed">{seller.bio}</p>
      </div>

      {seller.skills && seller.skills.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="text-purple-400" size={20} />{" "}
              ทักษะและความเชี่ยวชาญ
            </h2>
            <div className="flex gap-2 flex-wrap">
              {seller.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-slate-800/40 border border-white/5 text-slate-200 text-sm hover:bg-slate-700/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {seller.socials && Object.keys(seller.socials).length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Link2 className="text-purple-400" size={20} /> โซเชียลมีเดีย
            </h2>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(seller.socials).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800/40 border border-white/5 text-blue-400 text-sm hover:bg-slate-700/40 hover:text-blue-300 transition-all flex items-center gap-2"
                >
                  <Link2 size={14} />
                  {key}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="text-purple-400" size={20} /> สินค้าของร้าน
        </h2>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
