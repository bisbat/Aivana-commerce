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
    if (!user) return alert("Not authenticated");

    const payload = buildUpdatePayload();

    try {
      setSaving(true);
      // call update API: (sellerId, payload, token)
      const updated = await updateSellerProfile(sellerData.id, payload);

      // update local state with returned data (best if API returns updated seller)
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
        console.log("Updated seller:", updated);
      }

      router.push(`/seller/${sellerData.user.username}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading seller...</div>;
  if (!sellerData) return <div>No seller profile found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Seller — Store Info</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input
            type="text"
            value={sellerData.storeName}
            className="w-full border rounded px-3 py-2 cursor-not-allowed bg-white/0"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <Skills
          skills={formData.skills || []}
          onChange={(updatedSkills) =>
            setFormData((prev) => ({ ...prev, skills: updatedSkills }))
          }
        />

        <SocialLinks
          socials={formData.socials || {}}
          onChange={(updated) =>
            setFormData((prev) => ({ ...prev, socials: updated }))
          }
        />

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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border rounded font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              // reset to last saved
              if (!sellerData) return;
              setFormData({
                bio: sellerData.bio || "",
                location: sellerData.location || "",
                skills: sellerData.skills,
                socials: sellerData.socials || {},
                bankInfo: sellerData.bankInfo as BankInfo,
              });
            }}
            className="px-4 py-2 border rounded text-sm"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
