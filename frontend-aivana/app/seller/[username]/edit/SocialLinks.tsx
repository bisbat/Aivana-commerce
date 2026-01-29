"use client";

import { useState } from "react";
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

export function SocialLinks({ socials, onChange }: SocialLinksProps) {
  // derive used platforms (only those with a non-empty string)
  const usedPlatforms = (Object.keys(socials) as PlatformValue[]).filter(
    (k) => socials[k] && socials[k]!.trim() !== "",
  );

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => !usedPlatforms.includes(p.value as PlatformValue),
  );

  function handleRemove(platform: PlatformValue) {
    const updated: SocialLink = { ...socials };
    // remove the field
    // using delete keeps type but is fine at runtime
    delete (updated as any)[platform];
    onChange(updated);
  }

  function handleUpdateField(platform: PlatformValue, value: string) {
    const updated: SocialLink = { ...socials, [platform]: value };
    onChange(updated);
  }

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Social Links</h2>

      {/* Existing social inputs */}
      <div className="space-y-3 mb-4">
        {usedPlatforms.length === 0 && (
          <p className="text-gray-400 text-sm">No social links added yet.</p>
        )}

        {usedPlatforms.map((platform) => (
          <div key={platform} className="flex items-center gap-3">
            <span className="w-28 font-medium capitalize">{platform}</span>

            <input
              type="url"
              className="border rounded px-3 py-2 flex-1"
              value={socials[platform] ?? ""}
              onChange={(e) => handleUpdateField(platform, e.target.value)}
            />

            <button
              type="button"
              onClick={() => handleRemove(platform)}
              className="text-red-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add new social link */}
      {usedPlatforms.length < MAX_SOCIAL_LINKS && (
        <AddSocialForm
          platforms={availablePlatforms}
          onAdd={(platform, url) => {
            if (!platform || !url.trim()) return;
            if (usedPlatforms.length >= MAX_SOCIAL_LINKS) {
              alert(`You can add up to ${MAX_SOCIAL_LINKS} social links.`);
              return;
            }
            handleUpdateField(platform as PlatformValue, url.trim());
          }}
        />
      )}
    </section>
  );
}

/* AddSocialForm uses local component state */
function AddSocialForm({
  platforms,
  onAdd,
}: {
  platforms: { value: string; label: string }[];
  onAdd: (platform: string, url: string) => void;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [urlValue, setUrlValue] = useState<string>("");

  return (
    <div className="flex gap-2">
      <select
        className="border rounded px-3 py-2"
        value={selectedPlatform}
        onChange={(e) => setSelectedPlatform(e.target.value)}
      >
        <option value="" disabled>
          Select Platform
        </option>
        {platforms.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <input
        type="url"
        placeholder="Profile link"
        className="border rounded px-3 py-2 flex-1"
        value={urlValue}
        onChange={(e) => setUrlValue(e.target.value)}
      />

      <button
        type="button"
        onClick={() => {
          if (!selectedPlatform) {
            alert("Select a platform first");
            return;
          }
          if (!urlValue.trim()) {
            alert("Enter a URL");
            return;
          }
          onAdd(selectedPlatform, urlValue.trim());
          setSelectedPlatform("");
          setUrlValue("");
        }}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        Add
      </button>
    </div>
  );
}
