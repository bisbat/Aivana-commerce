"use client";

import React, { useState, useEffect } from "react";
import { UploadFileFormData } from "@/lib/types/formCreateProduct/UploadFileFormData";
import { ProductInformationFormData } from "@/lib/types/formCreateProduct/ProductInformationFormData";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllTagsAction } from "@/lib/actions/tag.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Dropdown";
import { MultiSelectTag } from "@/components/ui/MultiSelectTag";
import { Loader } from "lucide-react";
import { saveFormStep } from "@/lib/utils/formStorage";
import { PRODUCT_FORM_STEP } from "@/lib/constants/productFormSteps";
import { DynamicTextListInput } from "../ui/DynamicTextListInput";
import { InstallationGuideInput } from "../ui/InstallationGuideInput";
import { enrichProduct } from "@/lib/actions/product-enrichment.actions";

// NEW: This component no longer submits to backend
// It just collects data and passes to next step
interface ProductFormProps {
  sellerId: string;
  uploadData: UploadFileFormData;
  onNext: (data: ProductInformationFormData) => void;
  onBack: () => void;
  initialData?: ProductInformationFormData;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  sellerId,
  uploadData,
  onNext,
  onBack,
  initialData,
}) => {
  const isFormMeaningful = () =>
    name.trim() !== "" ||
    blurb.trim() !== "" ||
    description.trim() !== "" ||
    price !== "";

  // Form state
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [installationGuide, setInstallationGuide] = useState("");
  const [price, setPrice] = useState("");
  const [livePreview, setLivePreview] = useState("");
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [requirement, setRequirement] = useState<string[]>([]);
  const [techstack, setTechstack] = useState<string[]>([]);
  const [apiDocUrl, setApiDocUrl] = useState("");

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; description: string | null }>
  >([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getAllCategories(),
          getAllTagsAction(),
        ]);

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        setError(
          "Failed to load categories and tags. Please refresh the page.",
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name);
    setBlurb(initialData.blurb ?? "");
    setCategoryId(String(initialData.categoryId));
    setDescription(initialData.description ?? "");
    setFeatures(initialData.features ?? []);
    setInstallationGuide(initialData.installationGuide ?? "");
    setPrice(String(initialData.price));
    setLivePreview(initialData.previewUrl ?? "");
    setCompatibility(initialData.compatibility ?? []);
    setSelectedTagIds(initialData.tagIds ?? []);
  }, [initialData]);

  // Auto-enrich with AI — waits for tags & categories to load first (fixes race condition)
  useEffect(() => {
    if (!uploadData.useAI || !uploadData.metadata || initialData) return;
    // Wait until data has finished loading
    if (isLoadingData) return;

    const keywords = uploadData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    setIsEnriching(true);
    enrichProduct({
      metadata: uploadData.metadata,
      sellerKeywords: keywords,
      availableTags: tags.map((t) => t.name),
      availableCategories: categories.map((c) => ({
        id: Number(c.id),
        name: c.name,
      })),
    })
      .then((ai) => {
        setName(ai.productName);
        setBlurb(ai.blurb);
        setDescription(ai.description);
        setFeatures(ai.features ?? []);
        setTechstack(ai.techStack ?? []);
        setCompatibility(ai.compatibility ?? []);
        setRequirement(ai.requirements ?? []);
        setInstallationGuide(ai.installationGuide ?? "");

        // Map AI tag names → real tag IDs (case-insensitive)
        if (ai.tags?.length) {
          const matchedIds = ai.tags
            .map((aiName) =>
              tags.find((t) => t.name.toLowerCase() === aiName.toLowerCase()),
            )
            .filter(Boolean)
            .map((t) => Number(t!.id));
          setSelectedTagIds(matchedIds);
        }

        // Map AI category suggestion → real category ID (case-insensitive)
        if (ai.suggestedCategoryName) {
          const matched = categories.find(
            (c) =>
              c.name.toLowerCase() === ai.suggestedCategoryName!.toLowerCase(),
          );
          if (matched) setCategoryId(String(matched.id));
        }
      })
      .catch((err) => {
        console.error("Enrichment failed:", err);
        setError("AI เติมข้อมูลล้มเหลว — กรุณากรอกเองได้เลย");
      })
      .finally(() => setIsEnriching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingData]); // fire once after tags & categories finish loading

  useEffect(() => {
    if (!isFormMeaningful()) return;

    const data: ProductInformationFormData = {
      name,
      blurb,
      categoryId: categoryId ? Number(categoryId) : 0,
      sellerId,
      description,
      features,
      installationGuide,
      price: price ? Number(price) : 0,
      previewUrl: livePreview || null,
      compatibility,
      uploadedFilePath: null,
      heroImageUrl: null,
      tagIds: selectedTagIds,
      techstack,
      requirement,
      apiDocUrl,
    };

    saveFormStep(PRODUCT_FORM_STEP.PRODUCT_INFO, data);
  }, [
    name,
    blurb,
    categoryId,
    description,
    features,
    installationGuide,
    price,
    livePreview,
    compatibility,
    selectedTagIds,
    sellerId,
  ]);

  // Handle continue to next step
  const handleContinue = () => {
    setError(null);

    // Validate required fields
    if (!name) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!categoryId) {
      setError("กรุณาเลือกหมวดหมู่สินค้า");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("กรุณาระบุราคาที่ถูกต้อง");
      return;
    }

    if (!sellerId) {
      setError("ไม่พบข้อมูล Seller — กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    // Pass data to parent (page.tsx)
    const formData: ProductInformationFormData = {
      name,
      blurb,
      categoryId: Number(categoryId),
      sellerId: sellerId,
      description,
      features: features.filter((f) => f.trim() !== ""),
      installationGuide,
      price: Number(price),
      previewUrl: livePreview || null,
      compatibility: compatibility.filter((f) => f.trim() !== ""),
      uploadedFilePath: null,
      heroImageUrl: null,
      tagIds: selectedTagIds,
      techstack,
      requirement,
      apiDocUrl,
    };
    console.log("Product Information Form Data:", formData);

    onNext(formData);
  };

  if (isLoadingData && !isEnriching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader
            className="animate-spin text-purple-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-slate-400 text-sm">กำลังโหลดหมวดหมู่และแท็ก...</p>
        </div>
      </div>
    );
  }

  if (isEnriching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-full max-w-md">
          {/* Glowing card */}
          <div className="relative rounded-2xl border border-purple-500/40 bg-[#1a1840] p-8 shadow-[0_0_60px_-15px_#8a57fb]">
            {/* Animated gradient top bar */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl overflow-hidden">
              <div className="h-full w-full bg-linear-to-r from-purple-600 via-violet-400 to-purple-600 animate-[shimmer_1.8s_linear_infinite] bg-size-[200%_100%]" />
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40">
                <span className="text-3xl animate-pulse">⚡</span>
                {/* Orbit ring */}
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin [animation-duration:3s]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-center text-white font-semibold text-lg mb-1">
              AI กำลังวิเคราะห์สินค้าของคุณ
            </h3>
            <p className="text-center text-slate-400 text-sm mb-8">
              กรุณารอสักครู่ อาจใช้เวลาประมาณ 10-20 วินาที
            </p>

            {/* Step list */}
            <div className="space-y-3">
              {[
                { label: "อ่านข้อมูลจากไฟล์ที่อัปโหลด", delay: "0s" },
                {
                  label: "วิเคราะห์ dependencies และ framework",
                  delay: "0.6s",
                },
                { label: "จับคู่ Category & Tags ที่เหมาะสม", delay: "1.2s" },
                { label: "สร้างชื่อและรายละเอียดสินค้า", delay: "1.8s" },
              ].map(({ label, delay }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 opacity-0 animate-[fadeSlideIn_0.5s_ease_forwards]"
                  style={{ animationDelay: delay }}
                >
                  {/* Dot */}
                  <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                  </div>
                  <span className="text-slate-300 text-sm">{label}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-linear-to-r from-purple-600 to-violet-400 animate-[progressBar_18s_ease-in-out_forwards]" />
            </div>
          </div>
        </div>

        {/* Keyframes injected inline for Tailwind arbitrary */}
        <style>{`
          @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateX(-12px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes progressBar {
            0%   { width: 0%; }
            60%  { width: 70%; }
            90%  { width: 88%; }
            100% { width: 95%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← ย้อนกลับ
        </button>
        <div className="flex-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <span className="text-green-400 text-sm font-medium">
            อัปโหลดไฟล์
          </span>

          <div className="h-px w-12 bg-slate-700" />

          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-purple-400 text-sm font-medium">
            ข้อมูลสินค้า
          </span>

          <div className="h-px w-12 bg-slate-700" />

          <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold">
            3
          </div>
          <span className="text-slate-400 text-sm font-medium">
            รูปภาพสินค้า
          </span>
        </div>
      </div>

      {/* Show uploaded file info */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-400 text-sm mb-2">ไฟล์ที่อัปโหลด:</p>

        {uploadData.file ? (
          <>
            <p className="text-white font-medium">{uploadData.file.name}</p>
            <p className="text-slate-400 text-sm mt-1">
              ประเภท: {uploadData.productType}
            </p>
          </>
        ) : (
          <p className="text-yellow-400 text-sm">
            ไม่พบข้อมูลไฟล์หลังจาก refresh — กรุณาย้อนกลับและอัปโหลดใหม่
          </p>
        )}
      </div>

      {/* AI auto-filled badge */}
      {uploadData.useAI && uploadData.metadata && !isEnriching && (
        <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 flex items-center gap-2">
          <span className="text-purple-300 text-sm">
            ⚡ AI เติมข้อมูลให้อัตโนมัติแล้ว — ตรวจสอบและแก้ไขได้ตามต้องการ
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* All form fields - same as before */}
      <Input
        label="ชื่อสินค้า"
        value={name}
        onChange={setName}
        placeholder="ใส่ชื่อสินค้า"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="คำโปรย"
          value={blurb}
          onChange={setBlurb}
          placeholder="คำอธิบายสั้นๆ ดึงดูดใจ"
        />
        <Select
          label="หมวดหมู่"
          value={categoryId}
          onChange={setCategoryId}
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          placeholder="เลือกหมวดหมู่"
          required
        />
      </div>

      <Textarea
        label="รายละเอียดสินค้า"
        value={description}
        onChange={setDescription}
        placeholder="อธิบายสินค้าอย่างละเอียด..."
        rows={5}
      />

      <DynamicTextListInput
        label="ฟีเจอร์"
        value={features}
        onChange={setFeatures}
        placeholder="เช่น AI Chat, Image Generator"
        maxItems={6}
        required
      />

      <InstallationGuideInput
        value={installationGuide}
        onChange={setInstallationGuide}
      />

      <DynamicTextListInput
        label="Tech Stack"
        value={techstack}
        onChange={setTechstack}
        placeholder="เช่น React, Vue, Java"
        maxItems={6}
      />

      <DynamicTextListInput
        label="ความเข้ากันได้"
        value={compatibility}
        onChange={setCompatibility}
        placeholder="เช่น Windows, macOS, Chrome"
        maxItems={6}
      />

      <DynamicTextListInput
        label="ความต้องการของระบบ"
        value={requirement}
        onChange={setRequirement}
        placeholder="เช่น Node.js 18+, PostgreSQL 14+"
        maxItems={6}
      />

      <MultiSelectTag
        label="แท็ก"
        tags={tags}
        selectedTagIds={selectedTagIds}
        onChange={setSelectedTagIds}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ราคา (บาท)"
          value={price}
          onChange={setPrice}
          placeholder="0.00"
          type="number"
          required
        />
        <Input
          label="ลิงก์ตัวอย่าง (Live Preview)"
          value={livePreview}
          onChange={setLivePreview}
          placeholder="https://example.com"
          type="url"
        />
      </div>
      {uploadData.productType === "backend-template" && (
        <Input
          label="เอกสาร API"
          value={apiDocUrl}
          onChange={setApiDocUrl}
          placeholder="https://example.com"
          type="url"
        />
      )}

      {/* Continue Button - No longer submits to backend */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          ดำเนินการต่อ
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
