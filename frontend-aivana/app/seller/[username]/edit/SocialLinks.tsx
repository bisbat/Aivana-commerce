"use client";

import { useState, useEffect } from "react";
import { SocialLink } from "@/lib/types/user/sellerProfile";

const SOCIAL_PLATFORMS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
] as const;

const MAX_SOCIAL_LINKS = 5;

type PlatformValue = (typeof SOCIAL_PLATFORMS)[number]["value"];

interface SocialLinksProps {
  socials: SocialLink;
  onChange: (updated: SocialLink) => void;
}

interface SocialLinkItem {
  platform: string;
  url: string;
}

export function SocialLinks({ socials, onChange }: SocialLinksProps) {
  // Convert socials object to array format for local state
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() => {
    const links = Object.entries(socials)
      .filter(([_, url]) => url && url.trim() !== "")
      .map(([platform, url]) => ({ platform, url: url || "" }));

    // Always have at least one row
    return links.length > 0 ? links : [{ platform: "", url: "" }];
  });

  function handleSocialChange(
    index: number,
    field: "platform" | "url",
    value: string,
  ) {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };

    setSocialLinks(newLinks);

    // Convert back to SocialLink object format
    const newSocials: SocialLink = {};
    newLinks.forEach((link) => {
      if (link.platform && link.url.trim()) {
        newSocials[link.platform as PlatformValue] = link.url;
      }
    });

    onChange(newSocials);
  }

  function removeSocialLink(index: number) {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);

    // Convert back to SocialLink object format
    const newSocials: SocialLink = {};
    newLinks.forEach((link) => {
      if (link.platform && link.url.trim()) {
        newSocials[link.platform as PlatformValue] = link.url;
      }
    });

    onChange(newSocials);
  }

  function addSocialLink() {
    if (socialLinks.length >= MAX_SOCIAL_LINKS) {
      alert(`คุณสามารถเพิ่มได้สูงสุด ${MAX_SOCIAL_LINKS} ลิงก์`);
      return;
    }

    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  }

  function getAvailablePlatforms(
    currentIndex: number,
  ): { value: string; label: string }[] {
    const usedPlatforms = socialLinks
      .map((link, idx) => (idx !== currentIndex ? link.platform : null))
      .filter(Boolean);

    return SOCIAL_PLATFORMS.filter((p) => !usedPlatforms.includes(p.value));
  }

  return (
    <section>
      <label className="block text-white text-sm mb-2">
        โซเชียลมีเดีย (ไม่บังคับ)
      </label>
      <div className="space-y-3">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={link.platform}
              onChange={(e) =>
                handleSocialChange(index, "platform", e.target.value)
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
              onChange={(e) => handleSocialChange(index, "url", e.target.value)}
              placeholder="https://..."
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-[#8a57fb] text-white placeholder:text-slate-400 focus:outline-none transition-colors"
            />
            {socialLinks.length > 1 && (
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
          disabled={socialLinks.length >= MAX_SOCIAL_LINKS}
          className="w-full px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg border border-dashed border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + เพิ่มลิงก์โซเชียล ({socialLinks.length}/{MAX_SOCIAL_LINKS})
        </button>
      </div>
    </section>
  );
}
