"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductByIdAction,
  updateProductAction,
  deleteProductImageAction,
} from "@/lib/actions/product.actions";
import { Product } from "@/lib/types/product/Product";
import { ProductImages } from "@/lib/types/product/product_images";
import { getAllTagsAction } from "@/lib/actions/tag.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Dropdown";
import { MultiSelectTag } from "@/components/ui/MultiSelectTag";
import { Tag } from "@/lib/types/tag";
import { Category } from "@/lib/types/category";
import { getAllCategories } from "@/lib/actions/category.actions";
import { DynamicTextListInput } from "@/components/ui/DynamicTextListInput";
import EditProductImages from "./EditProductImages";
import EditProductHeroImage from "./EditProductHeroImage";
import EditProductFile from "./EditProductFile";
import BackButton from "./BackButton";
import { InstallationGuideInput } from "@/components/ui/InstallationGuideInput";

export interface UpdatedProductData {
  name: string;
  blurb: string;
  description: string;
  categoryId: string;
  features: string;
  installationGuide: string;
  compatibility: string;
  techstack: string;
  requirement: string;
  tagIds: string;
  price: string;
  previewUrl: string;
  apiDocUrl: string;
  files?: {
    heroImage?: File | null;
    productFile?: File | null;
    detailImages?: File[] | null;
  };
}

function SectionCard({
  title,
  accent = false,
  children,
}: {
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`
        relative rounded-2xl border p-6 overflow-hidden
        ${accent ? "border-violet-500/20" : "border-white/[0.06]"}
      `}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          accent ? "via-violet-500/50" : "via-white/[0.08]"
        }`}
      />
      <div className="flex items-center gap-2 mb-5">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <h2 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-white/30 whitespace-nowrap">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function EditProductPage() {
  const params = useParams();
  const productId = String(params.productId);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [productData, setProductData] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [installationGuide, setInstallationGuide] = useState("");
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [techstack, setTechstack] = useState<string[]>([]);
  const [requirement, setRequirement] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [previewUrl, setpreviewUrl] = useState("");
  const [apiDocUrl, setApiDocUrl] = useState("");

  const [currentHeroImage, setCurrentHeroImage] = useState<string | null>(null);
  const [newHeroImageFile, setNewHeroImageFile] = useState<File | null>(null);
  const [currentProductFile, setCurrentProductFile] = useState<string | null>(null);
  const [newProductFile, setNewProductFile] = useState<File | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [detailImages, setDetailImages] = useState<ProductImages[]>([]);

  useEffect(() => {
    async function fetchFormData() {
      const product: Product = await getProductByIdAction(productId);
      setProductData(product);

      const allTags: Tag[] = await getAllTagsAction();
      setTags(allTags);

      const allCategories: Category[] = await getAllCategories();
      setCategories(allCategories);

      setName(product.name);
      setBlurb(product.blurb || "");
      setDescription(product.description);
      setCategoryId(product.category.id);
      setFeatures(product.features || []);
      setInstallationGuide(product.installationGuide);
      setCompatibility(product.compatibility || []);
      setRequirement(product.requirement || []);
      setTechstack(product.techstack || []);
      setSelectedTagIds(product.tags.map((tag) => parseInt(tag.id)));
      setPrice(product.price.toString());
      setpreviewUrl(product.previewUrl || "");
      setApiDocUrl(product.apiDocUrl || "");
      setCurrentHeroImage(product.heroImageUrl || null);
      setCurrentProductFile(product.uploadedFilePath || null);
      setDetailImages(product.detailImages || []);
    }

    fetchFormData();
  }, [productId]);

  if (!productData) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />
            <div className="absolute inset-1 rounded-full border-2 border-t-violet-500 border-violet-500/10 animate-spin" />
          </div>
          <p className="text-white/30 text-sm tracking-wide animate-pulse">Loading product…</p>
        </div>
      </div>
    );
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteProductImageAction(imageId);
      setDetailImages((prev) => prev.filter((img) => img.imageId !== imageId));
      setDeletedImageIds((prev) => [...prev, imageId]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProductData: UpdatedProductData = {
      name,
      blurb,
      description,
      categoryId,
      features: JSON.stringify(features),
      installationGuide,
      compatibility: JSON.stringify(compatibility),
      techstack: JSON.stringify(techstack),
      requirement: JSON.stringify(requirement),
      tagIds: JSON.stringify(selectedTagIds),
      price,
      previewUrl,
      apiDocUrl,
      files: {
        heroImage: newHeroImageFile,
        productFile: newProductFile,
        detailImages: newImageFiles,
      },
    };

    setIsSaving(true);
    await updateProductAction(productId, updatedProductData);
    setIsSaving(false);
    router.push(`/stores/products/${productId}`);
  };

  return (
    <div className="min-h-screen text-white">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-800/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-800/[0.06] blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-8">

        {/* Back button */}
        <div className="mb-8">
          <BackButton productId={productId} />
        </div>

        {/* Page title block */}
        <div className="relative rounded-2xl border border-violet-500/20 bg-[#15132a]/60 backdrop-blur-sm p-8 overflow-hidden mb-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-violet-400/70 mb-2">
            การจัดการสินค้า
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">แก้ไขสินค้า</h1>
          <p className="text-white/30 text-sm">
            กำลังแก้ไข <span className="text-white/60 font-medium">{name || "…"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* ── MEDIA — at the TOP, just like the detail page ─────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SectionCard title="ภาพฮีโร่ (Hero Image)">
                <EditProductHeroImage
                  currentImage={currentHeroImage}
                  newImageFile={newHeroImageFile}
                  onImageChange={setNewHeroImageFile}
                  onRemoveImage={() => {
                    setCurrentHeroImage(null);
                    setNewHeroImageFile(null);
                  }}
                />
              </SectionCard>

              <SectionCard title="ไฟล์สินค้า (Product File)">
                <EditProductFile
                  currentFile={currentProductFile}
                  newFile={newProductFile}
                  onFileChange={setNewProductFile}
                  onRemoveFile={() => {
                    setCurrentProductFile(null);
                    setNewProductFile(null);
                  }}
                />
              </SectionCard>

              <SectionCard title="ภาพแกลเลอรี่ (Gallery Images)">
                <EditProductImages
                  existingImages={detailImages}
                  newImageFiles={newImageFiles}
                  onAddImages={(files) => setNewImageFiles((prev) => [...prev, ...files])}
                  onDeleteImage={handleDeleteImage}
                  onRemoveNewImage={(index) =>
                    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              </SectionCard>
            </div>

            {/* ── FORM SECTIONS — single column below media ──────────────── */}
            <SectionCard title="ข้อมูลพื้นฐาน" accent>
              <Input label="ชื่อสินค้า" value={name} onChange={setName} required />
              <Input label="คำอธิบายสั้น ๆ" value={blurb} onChange={setBlurb} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="ประเภทสินค้า (Category)"
                  value={categoryId}
                  onChange={setCategoryId}
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  required
                />
                <MultiSelectTag
                  label="แท็ก (Tags)"
                  tags={tags}
                  selectedTagIds={selectedTagIds}
                  onChange={setSelectedTagIds}
                />
              </div>
            </SectionCard>

            <SectionCard title="รายละเอียดสินค้า">
              <Textarea
                label="คำอธิบาย (Description)"
                value={description}
                onChange={setDescription}
                rows={5}
              />
              <DynamicTextListInput
                label="คุณสมบัติ (Features)"
                value={features}
                onChange={setFeatures}
                maxItems={6}
              />
            </SectionCard>

            <SectionCard title="ข้อมูลทางเทคนิค (Technical Details)">
              <InstallationGuideInput
                value={installationGuide}
                onChange={setInstallationGuide}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DynamicTextListInput label="Tech Stack (เทคนิคที่ใช้)" value={techstack} onChange={setTechstack} />
                <DynamicTextListInput label="Requirements (ข้อกำหนด)" value={requirement} onChange={setRequirement} />
              </div>
              <DynamicTextListInput label="Compatibility (ความเข้ากันได้)" value={compatibility} onChange={setCompatibility} />
              <Input label="API Documentation URL (URL เอกสาร API)" value={apiDocUrl} onChange={setApiDocUrl} />
            </SectionCard>

            <SectionCard title="ราคาและลิงก์">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Price (THB)" value={price} onChange={setPrice} type="number" required />
                <Input label="Live Preview URL (URL ตัวอย่าง)" value={previewUrl} onChange={setpreviewUrl} />
              </div>
            </SectionCard>

          </div>

          {/* ── Action bar — floating centered pill ───────────────────── */}
          <div className="sticky bottom-4 z-50 flex justify-center mt-10">
            <div className="w-full max-w-5xl">
              <div className="
                flex items-center justify-between
                px-6 py-4
                rounded-2xl
                border border-white/[0.08]
                bg-[#15132a]/80
                backdrop-blur-xl
                shadow-xl
              ">

                {/* Left side */}
                <div className="flex flex-col">
                  <p className="text-sm text-slate-300 font-medium">ยังมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</p>
                  <p className="text-xs text-slate-500">อย่าลืมบันทึกก่อนออกจากหน้านี้</p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="
                      px-5 py-2 rounded-xl
                      border border-white/[0.08] text-slate-300
                      hover:bg-white/[0.06] hover:text-white
                      transition-all
                    "
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="
                      px-6 py-2 rounded-xl
                      bg-violet-600 hover:bg-violet-500
                      text-white font-semibold
                      shadow-lg hover:shadow-xl
                      transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2
                    "
                  >
                    {isSaving && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}