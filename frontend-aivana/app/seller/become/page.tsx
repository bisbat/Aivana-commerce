"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { becomeSeller } from "@/lib/actions/seller.actions";
import { CreateSellerProfileDto } from "@/lib/types/user/sellerCreate";
import { getCurrentUser } from "@/lib/auth";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import BackgroundAivana from "@/components/common/BackgroundAivana";

const SOCIAL_PLATFORMS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
];

const MAX_SKILLS = 10;
const MAX_TOOLS = 15;
const MAX_SOCIAL_LINKS = 5;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const BANKS = [
  {
    code: "kbank",
    name: "ธนาคารกสิกรไทย",
    logo: `${basePath}/become-seller/logo-bank/kbank.jpg`,
  },
  {
    code: "scb",
    name: "ธนาคารไทยพาณิชย์",
    logo: `${basePath}/become-seller/logo-bank/scb.png`,
  },
  {
    code: "ktb",
    name: "ธนาคารกรุงไทย",
    logo: `${basePath}/become-seller/logo-bank/ktb.png`,
  },
  {
    code: "bbl",
    name: "ธนาคารกรุงเทพ",
    logo: `${basePath}/become-seller/logo-bank/bbl.jpg`,
  },
  {
    code: "bay",
    name: "ธนาคารกรุงศรีอยุธยา",
    logo: `${basePath}/become-seller/logo-bank/bay.jpg`,
  },
];

export default function BecomeSellerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    skills: [""],
    socialLinks: [{ platform: "", url: "" }],
    bankCode: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getSelectedPlatforms = () => {
    return formData.socialLinks.map((link) => link.platform).filter(Boolean);
  };

  const getAvailablePlatforms = (currentIndex: number) => {
    const selectedPlatforms = getSelectedPlatforms();
    const currentPlatform = formData.socialLinks[currentIndex].platform;
    return SOCIAL_PLATFORMS.filter(
      (platform) =>
        !selectedPlatforms.includes(platform.value) ||
        platform.value === currentPlatform,
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleArrayChange = (index: number, value: string, field: "skills") => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleSocialLinkChange = (
    index: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      socialLinks: newLinks,
    }));
  };

  const addArrayItem = (field: "skills") => {
    const maxLimit = field === "skills" ? MAX_SKILLS : MAX_TOOLS;
    if (formData[field].length >= maxLimit) return;

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const addSocialLink = () => {
    if (formData.socialLinks.length >= MAX_SOCIAL_LINKS) return;

    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const removeArrayItem = (index: number, field: "skills") => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [field]: newArray,
      }));
    }
  };

  const removeSocialLink = (index: number) => {
    if (formData.socialLinks.length > 1) {
      const newLinks = formData.socialLinks.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        socialLinks: newLinks,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bio.trim()) {
      newErrors.bio = "กรุณากรอกแนะนำตัวเอง";
    }

    if (!formData.location.trim()) {
      newErrors.location = "กรุณากรอกที่อยู่";
    }

    if (formData.skills.every((s) => !s.trim())) {
      newErrors.skills = "กรุณากรอกทักษะอย่างน้อย 1 รายการ";
    }

    formData.socialLinks.forEach((link, index) => {
      const hasPlatform = link.platform.trim();
      const hasUrl = link.url.trim();

      if (hasPlatform && !hasUrl) {
        newErrors[`socialLink_${index}`] =
          "กรุณากรอก URL สำหรับแพลตฟอร์มที่เลือก";
      } else if (!hasPlatform && hasUrl) {
        newErrors[`socialLink_${index}`] =
          "กรุณาเลือกแพลตฟอร์มสำหรับ URL ที่กรอก";
      }
    });

    if (!formData.bankCode) {
      newErrors.bankCode = "กรุณาเลือกธนาคาร";
    }

    if (!formData.bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = "กรุณากรอกเลขบัญชี";
    }

    if (!formData.bankAccountName.trim()) {
      newErrors.bankAccountName = "กรุณากรอกชื่อบัญชี";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showErrorToast("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);

    try {
      const submitData: CreateSellerProfileDto = {
        bio: formData.bio,
        location: formData.location,

        skills: formData.skills.filter((s) => s.trim()),

        socials: formData.socialLinks
          .filter((link) => link.platform.trim() && link.url.trim())
          .reduce(
            (acc, link) => {
              acc[link.platform.toLowerCase()] = link.url;
              return acc;
            },
            {} as Record<string, string>,
          ),

        bankInfo: {
          bankName: BANKS.find((b) => b.code === formData.bankCode)?.name || "",
          bankCode: formData.bankCode,
          accountNumber: formData.bankAccountNumber,
          accountName: formData.bankAccountName,
        },
      };

      const user = await getCurrentUser();

      if (!user) {
        showErrorToast("กรุณาเข้าสู่ระบบก่อนสมัครเป็นผู้ขาย");
        throw new Error("Not authenticated");
      }

      await becomeSeller(submitData, user.id);

      showSuccessToast("สมัครเป็นผู้ขายสำเร็จ!");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("❌ Become seller error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการสมัครเป็นผู้ขาย";
      setErrors({ submit: errorMessage });
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundAivana />
      <div className="w-full max-w-2xl relative z-10 mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            สมัครเป็นผู้ขาย
          </h1>
          <p className="text-slate-400">กรอกข้อมูลเพื่อเริ่มต้นขายสินค้า</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                แนะนำตัวเอง <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="เล่าเกี่ยวกับตัวคุณ ประสบการณ์ และสิ่งที่ทำให้คุณเป็นผู้ขายที่ยอดเยี่ยม"
                rows={3}
                className={`w-full bg-slate-900/50 border ${
                  errors.bio
                    ? "border-red-500"
                    : "border-slate-700 focus:border-[#8a57fb]"
                } rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all resize-none`}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ที่อยู่ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="กรุงเทพมหานคร, ประเทศไทย"
                className={`w-full bg-slate-900/50 border ${
                  errors.location
                    ? "border-red-500"
                    : "border-slate-700 focus:border-[#8a57fb]"
                } rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              ทักษะ <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "skills")
                    }
                    placeholder="เช่น การออกแบบกราฟิก, การพัฒนาเว็บ"
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-[#8a57fb] text-white placeholder:text-slate-400 focus:outline-none transition-colors"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "skills")}
                      className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      ลบ
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("skills")}
                disabled={formData.skills.length >= MAX_SKILLS}
                className="w-full px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg border border-dashed border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + เพิ่มทักษะ ({formData.skills.length}/{MAX_SKILLS})
              </button>
            </div>
            {errors.skills && (
              <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
            )}
          </div>

          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              โซเชียลมีเดีย (ไม่บังคับ)
            </label>
            <div className="space-y-3">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={link.platform}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "platform", e.target.value)
                    }
                    className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-[#8a57fb] text-white focus:outline-none transition-colors"
                  >
                    <option value="" disabled>
                      เลือกแพลตฟอร์ม
                    </option>
                    {getAvailablePlatforms(index).map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-[#8a57fb] text-white placeholder:text-slate-400 focus:outline-none transition-colors"
                  />
                  {formData.socialLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      ลบ
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                disabled={formData.socialLinks.length >= MAX_SOCIAL_LINKS}
                className="w-full px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg border border-dashed border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + เพิ่มลิงก์โซเชียล ({formData.socialLinks.length}/
                {MAX_SOCIAL_LINKS})
              </button>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white">
              ข้อมูลบัญชีธนาคาร
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                เลือกธนาคาร <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BANKS.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bankCode: bank.code,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      formData.bankCode === bank.code
                        ? "border-[#8a57fb] bg-[#8a57fb]/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                        <Image
                          src={bank.logo}
                          alt={bank.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-white text-xs text-center">
                        {bank.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.bankCode && (
                <p className="text-red-500 text-xs mt-1">{errors.bankCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                เลขบัญชี <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="1234567890"
                className={`w-full bg-slate-900/50 border ${
                  errors.bankAccountNumber
                    ? "border-red-500"
                    : "border-slate-700 focus:border-[#8a57fb]"
                } rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all`}
              />
              {errors.bankAccountNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bankAccountNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ชื่อบัญชี <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`w-full bg-slate-900/50 border ${
                  errors.bankAccountName
                    ? "border-red-500"
                    : "border-slate-700 focus:border-[#8a57fb]"
                } rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all`}
              />
              {errors.bankAccountName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bankAccountName}
                </p>
              )}
            </div>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-2.5 bg-[#8a57fb] hover:bg-[#732ee2] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังส่งข้อมูล..." : "สมัครเป็นผู้ขาย"}
          </button>
        </form>
      </div>
    </div>
  );
}
