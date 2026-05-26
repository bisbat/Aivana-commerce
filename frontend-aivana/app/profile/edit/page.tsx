"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { updateUserProfile } from "@/lib/actions/user.actions";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { UserProfile } from "@/lib/types/user/user";

const ProfileSettingsPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    avatarUrl: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        setUserData(user);
        setFormData({
          username: user.username || "",
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          avatarUrl: user.avatarUrl || "",
          bio: user.bio || "",
        });
        setPreviewUrl(user.avatarUrl || "");
      } catch (error) {
        showErrorToast("ไม่สามารถโหลดข้อมูลผู้ใช้");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showErrorToast("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) return;

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        bio: formData.bio.trim() || "ฉันยังไม่มีข้อมูลเกี่ยวกับตัวเอง",
      };
      await updateUserProfile(
        userData.id,
        dataToSave,
        selectedFile || undefined,
      );
      showSuccessToast("บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push(`/${formData.username}`);
    } catch (error: any) {
      showErrorToast(error.message || "ไม่สามารถบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BackgroundAivana />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundAivana />
      <div className="w-full max-w-2xl relative z-10 mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">แก้ไขโปรไฟล์</h1>
          <p className="text-slate-400">อัพเดทข้อมูลส่วนตัวของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={formData.username}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-[#8a57fb]/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-4xl font-bold text-white ring-2 ring-[#8a57fb]/20">
                    {formData.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleFileClick}
                  disabled={saving}
                  className="absolute bottom-0 right-0 bg-[#8a57fb] rounded-full p-2 cursor-pointer hover:bg-[#732ee2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera size={16} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  URL รูปโปรไฟล์{" "}
                  {selectedFile && (
                    <span className="text-green-400">
                      (ไฟล์ใหม่: {selectedFile.name})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  หรือกดที่ไอคอนกล้องเพื่ออัพโหลดรูปภาพ (ขนาดไม่เกิน 5MB)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-[#8a57fb]" />
                ข้อมูลผู้ใช้
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ชื่อผู้ใช้ <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Mail size={16} />
                อีเมล <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ชื่อจริง <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
                placeholder="ชื่อจริง"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                นามสกุล <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
                placeholder="นามสกุล"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                เกี่ยวกับตัวเอง
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all resize-none"
                placeholder="เล่าเกี่ยวกับตัวคุณ..."
                maxLength={500}
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.bio.length}/500 ตัวอักษร
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-600 font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-[#8a57fb] hover:bg-[#732ee2] text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
