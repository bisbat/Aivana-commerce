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
import { ProductUpdatePayload } from "@/lib/types/product/UpdateProductPayload";

export interface UpdatedProductData {
  name: string;
  blurb: string;
  description: string;
  categoryId: string;
  features: string; // JSON string of string[]
  installationGuide: string;
  compatibility: string; // JSON string of string[]
  techstack: string; // JSON string of string[]
  requirement: string; // JSON string of string[]
  tagIds: string; // JSON string of number[]
  price: string;
  previewUrl: string;
  apiDocUrl: string;
  files?: {
    heroImage?: File | null;
    productFile?: File | null;
    detailImages?: File[] | null;
  };
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

  const [currentProductFile, setCurrentProductFile] = useState<string | null>(
    null,
  );
  const [newProductFile, setNewProductFile] = useState<File | null>(null);

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [detailImages, setDetailImages] = useState<ProductImages[]>([]);

  useEffect(() => {
    async function fetchFormData() {
      const product: Product = await getProductByIdAction(productId);
      setProductData(product);

      const tags: Tag[] = await getAllTagsAction();
      setTags(tags);

      const categories: Category[] = await getAllCategories();
      setCategories(categories);
      setName(product.name);
      setBlurb(product.blurb || "");
      setDescription(product.description);
      setCategoryId(product.category.id);
      setFeatures(product.features || []);
      setInstallationGuide(product.installationGuide);
      setCompatibility(product.compatibility || []);
      setRequirement(product.requirement || [])
      setTechstack(product.techstack || [])
      setSelectedTagIds(product.tags.map((tag) => parseInt(tag.id)));
      setPrice(product.price.toString());
      setpreviewUrl(product.previewUrl || "");
      setApiDocUrl(product.apiDocUrl || "")
      setCurrentHeroImage(product.heroImageUrl || null);
      setCurrentProductFile(product.uploadedFilePath || null);
      setDetailImages(product.detailImages || []);
    }

    fetchFormData();
  }, [productId]);

  if (!productData) return <div>Loading...</div>;

  const handleHeroImageChange = (file: File | null) => {
    setNewHeroImageFile(file);
  };

  const handleRemoveHeroImage = () => {
    setCurrentHeroImage(null);
    setNewHeroImageFile(null);
  };

  const handleProductFileChange = (file: File | null) => {
    setNewProductFile(file);
  };

  const handleRemoveProductFile = () => {
    setCurrentProductFile(null);
    setNewProductFile(null);
  };

  // Handler for adding new image files
  const handleAddImages = (files: File[]) => {
    setNewImageFiles((prev) => [...prev, ...files]);
  };

  // Handler for removing existing image
  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteProductImageAction(imageId);

      setDetailImages((prev) => prev.filter((img) => img.imageId !== imageId));
      setDeletedImageIds((prev) => [...prev, imageId]);
    } catch (error) {
      console.error(error);
    }
  };
  // Handler for removing new image file
  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
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
      price: price,
      previewUrl,
      files: {
        heroImage: newHeroImageFile,
        productFile: newProductFile,
        detailImages: newImageFiles,
      },
      apiDocUrl,
    };
    setIsSaving(true);
    await updateProductAction(productId, updatedProductData);
    setIsSaving(false);
    router.push(`/stores/products/${productId}`);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <BackButton productId={productId} />
            <h1 className="text-3xl font-bold mt-2">Edit Product</h1>
            <p className="text-slate-400 text-sm">
              Update your product details and assets
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-8">

              {/* SECTION: BASIC INFO */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Basic Info</h2>

                <div className="space-y-4">
                  <Input label="Product Name" value={name} onChange={setName} required />
                  <Input label="Blurb" value={blurb} onChange={setBlurb} />

                  <Select
                    label="Category"
                    value={categoryId}
                    onChange={setCategoryId}
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                    required
                  />

                  <MultiSelectTag
                    label="Tags"
                    tags={tags}
                    selectedTagIds={selectedTagIds}
                    onChange={setSelectedTagIds}
                  />
                </div>
              </div>

              {/* SECTION: DESCRIPTION */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Description</h2>

                <Textarea
                  label="Product Description"
                  value={description}
                  onChange={setDescription}
                  rows={5}
                />

                <DynamicTextListInput
                  label="Features"
                  value={features}
                  onChange={setFeatures}
                  maxItems={6}
                />
              </div>

              {/* SECTION: TECHNICAL */}
              <div className="p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Technical Details</h2>

                <InstallationGuideInput
                  value={installationGuide}
                  onChange={setInstallationGuide}
                />

                <DynamicTextListInput
                  label="Techstack"
                  value={techstack}
                  onChange={setTechstack}
                />

                <DynamicTextListInput
                  label="Requirement"
                  value={requirement}
                  onChange={setRequirement}
                />

                <DynamicTextListInput
                  label="Compatibility"
                  value={compatibility}
                  onChange={setCompatibility}
                />
              </div>

              {/* SECTION: PRICING */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Pricing & Links</h2>

                <div className="space-y-4">
                  <Input label="Price" value={price} onChange={setPrice} type="number" required />
                  <Input label="Live Preview" value={previewUrl} onChange={setpreviewUrl} />
                  <Input label="API Documentation" value={apiDocUrl} onChange={setApiDocUrl} />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (STICKY MEDIA PANEL) */}
            <div className="space-y-6 sticky top-6 h-fit">

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Hero Image</h2>
                <EditProductHeroImage
                  currentImage={currentHeroImage}
                  newImageFile={newHeroImageFile}
                  onImageChange={handleHeroImageChange}
                  onRemoveImage={handleRemoveHeroImage}
                />
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Product File</h2>
                <EditProductFile
                  currentFile={currentProductFile}
                  newFile={newProductFile}
                  onFileChange={handleProductFileChange}
                  onRemoveFile={handleRemoveProductFile}
                />
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">Images</h2>
                <EditProductImages
                  existingImages={detailImages}
                  newImageFiles={newImageFiles}
                  onAddImages={handleAddImages}
                  onDeleteImage={handleDeleteImage}
                  onRemoveNewImage={handleRemoveNewImage}
                />
              </div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="sticky bottom-0 z-50 mt-10">
            <div className="backdrop-blur bg-slate-950/70 border-t border-slate-800 px-6 py-4">

              <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Left side (hint / status) */}
                <p className="text-sm text-slate-400">
                  Changes are not saved automatically
                </p>

                {/* Right side (actions) */}
                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
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
