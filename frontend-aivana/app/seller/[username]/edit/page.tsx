"use client";

import { useEffect, useState } from "react";
import {
  getSellerById,
  updateSellerProfile,
} from "@/lib/actions/seller.actions";
import { getCurrentUser } from "@/lib/auth";
import { SellerProfile } from "@/lib/types/user/sellerProfile";
import { SocialLink } from "@/lib/types/user/sellerProfile";
import { Skills } from "./SkillsProps";
import { SocialLinks } from "./SocialLinks";
import BankInfoSection from "./BankInfoSection";
import { BankInfo } from "@/lib/types/user/sellerProfile";
import { useRouter } from "next/navigation";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import {
  Store,
  MapPin,
  FileText,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

export default function EditSellerSellerInfo() {
  const router = useRouter();
  const [sellerData, setSellerData] = useState<SellerProfile | null>(null);
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    skills: [""],
    socials: {} as SocialLink,
    bankInfo: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // load seller
  useEffect(() => {
    async function load() {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || !user.sellerId) {
        setLoading(false);
        return;
      }
      const seller = await getSellerById(user.sellerId);
      if (!seller) {
        setLoading(false);
        return;
      }
      setSellerData(seller);
      setFormData({
        bio: seller.bio || "",
        location: seller.location || "",
        skills: seller.skills || [],
        socials: seller.socials || {},
        bankInfo: seller.bankInfo || {
          bankName: "",
          accountNumber: "",
          accountName: "",
        },
      });
      setLoading(false);
    }
    load();
  }, []);

  console.log(formData);
  console.log(formData.bankInfo);

  // simple handler for normal fields
  function handleChange(field: "bio" | "location", value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // build payload for updateSellerProfile
  function buildUpdatePayload() {
    // convert skills -> string[]
    const skills = formData.skills.map((s) => s.trim()).filter(Boolean); // remove empty strings

    return {
      bio: formData.bio,
      location: formData.location,
      skills,
      socials: formData.socials,
      bankInfo: {
        bankName: formData.bankInfo.bankName,
        accountNumber: formData.bankInfo.accountNumber,
        accountName: formData.bankInfo.accountName,
      },
    } as Partial<SellerProfile>;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!sellerData) return;
    const user = await getCurrentUser();
    if (!user) {
      showErrorToast("ไม่สามารถยืนยันตัวตนได้");
      return;
    }

    const payload = buildUpdatePayload();

    try {
      setSaving(true);
      const updated = await updateSellerProfile(sellerData.id, payload);

      if (updated) {
        setSellerData((prev) => ({
          ...(prev as SellerProfile),
          ...(updated as any),
        }));
        setFormData({
          bio: updated.bio || "",
          location: updated.location || "",
          skills: updated.skills || [],
          socials: updated.socials || {},
          bankInfo: updated.bankInfo as BankInfo,
        });
      }

      showSuccessToast("บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push(`/seller/${sellerData.user.username}`);
    } catch (err) {
      console.error(err);
      showErrorToast("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BackgroundAivana />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!sellerData) {
    return (
      <div className="relative min-h-screen">
        <BackgroundAivana />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <AlertCircle className="w-16 h-16 text-red-400" />
            <h2 className="text-2xl font-bold text-white">ไม่พบข้อมูล Store</h2>
            <p className="text-slate-400">กรุณาลองใหม่อีกครั้ง</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              กลับ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundAivana />
      <div className="w-full max-w-4xl relative z-10 mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            แก้ไขข้อมูล Store
          </h1>
          <p className="text-slate-400">
            อัพเดทข้อมูลร้านค้าและข้อมูลผู้ขายของคุณ
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Information */}
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Store size={20} className="text-[#8a57fb]" />
                ข้อมูล Store
              </h3>
            </div>

            {/* Store Name (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ชื่อ Store
              </label>
              <input
                type="text"
                value={sellerData.storeName}
                className="w-full bg-slate-900/30 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white/50 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">
                ไม่สามารถเปลี่ยนชื่อ Store ได้
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                ที่อยู่
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
                placeholder="เช่น กรุงเทพมหานคร, ประเทศไทย"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <FileText size={16} />
                คำอธิบาย Store
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all resize-none"
                placeholder="บอกเล่าเกี่ยวกับร้านค้าของคุณ..."
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <Skills
              skills={formData.skills || []}
              onChange={(updatedSkills) =>
                setFormData((prev) => ({ ...prev, skills: updatedSkills }))
              }
            />
          </div>

          {/* Social Links Section */}
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <SocialLinks
              socials={formData.socials || {}}
              onChange={(updated) =>
                setFormData((prev) => ({ ...prev, socials: updated }))
              }
            />
          </div>

          {/* Bank Information Section */}
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <BankInfoSection
              bankInfo={
                formData.bankInfo || {
                  bankName: "",
                  accountNumber: "",
                  accountName: "",
                }
              }
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  bankInfo: { ...prev.bankInfo, ...value },
                }))
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => {
                if (!sellerData) return;
                setFormData({
                  bio: sellerData.bio || "",
                  location: sellerData.location || "",
                  skills: sellerData.skills,
                  socials: sellerData.socials || {},
                  bankInfo: sellerData.bankInfo as BankInfo,
                });
              }}
              disabled={saving}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              รีเซ็ต
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#8a57fb] hover:bg-[#732ee2] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save size={18} />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
