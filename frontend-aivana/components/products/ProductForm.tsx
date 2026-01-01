"use client";

import React, { useState, useEffect } from "react";
import { UploadFileFormData } from "@/lib/types/formCreateProduct/UploadFileFormData";
import { ProductInformationFormData } from "@/lib/types/formCreateProduct/ProductInformationFormData";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllTagsAction } from "@/lib/actions/tag.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Dropdown";
import { CompatibilityInput } from "../ui/CompatibilityInput";
import { FeatureInput } from "@/components/ui/FeatureInput";
import { MultiSelectTag } from "@/components/ui/MultiSelectTag";
import { Loader } from "lucide-react";
import { getAuthData } from "@/lib/actions/auth.actions";

// NEW: This component no longer submits to backend
// It just collects data and passes to next step
interface ProductFormProps {
  sellerId: string;
  uploadData: UploadFileFormData;
  onNext: (data: ProductInformationFormData) => void; // Changed from onBack
  onBack: () => void;
  initialData?: ProductInformationFormData;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  sellerId,
  uploadData,
  onNext,
  onBack,
  initialData
}) => {
  // Form state
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [installationGuide, setInstallationGuide] = useState("");
  const [price, setPrice] = useState("");
  const [livePreview, setLivePreview] = useState("");
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; description: string | null }>
  >([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          "Failed to load categories and tags. Please refresh the page."
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


  // Handle continue to next step
  const handleContinue = () => {
    setError(null);

    // Validate required fields
    if (!name) {
      setError("Please fill in all required fields");
      return;
    }

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (!sellerId) {
      setError("Seller ID is missing. Please log in again.");
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
    };
    console.log("Product Information Form Data:", formData);

    onNext(formData);
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader
            className="animate-spin text-purple-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-white">Loading categories and tags...</p>
        </div>
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
            Upload File
          </span>

          <div className="h-px w-12 bg-slate-700" />

          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-purple-400 text-sm font-medium">
            Product Information
          </span>

          <div className="h-px w-12 bg-slate-700" />

          <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold">
            3
          </div>
          <span className="text-slate-400 text-sm font-medium">
            Product Images
          </span>
        </div>
      </div>

      {/* Show uploaded file info */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-400 text-sm mb-2">Uploaded file:</p>
        <p className="text-white font-medium">{uploadData.file?.name}</p>
        <p className="text-slate-400 text-sm mt-1">
          Type: {uploadData.productType}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* All form fields - same as before */}
      <Input
        label="Product Name"
        value={name}
        onChange={setName}
        placeholder="Enter product name"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Blurb"
          value={blurb}
          onChange={setBlurb}
          placeholder="Short description"
        />
        <Select
          label="Category"
          value={categoryId}
          onChange={setCategoryId}
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          placeholder="Select a category"
          required
        />
      </div>

      <Textarea
        label="Product Description"
        value={description}
        onChange={setDescription}
        placeholder="Detailed description..."
        rows={5}
      />

      <FeatureInput features={features} onChange={setFeatures} />

      <Textarea
        label="Installation Document"
        value={installationGuide}
        onChange={setInstallationGuide}
        placeholder="Installation Document..."
        rows={4}
      />

      <CompatibilityInput
        compatibility={compatibility}
        onChange={setCompatibility}
      />

      <MultiSelectTag
        label="Tags"
        tags={tags}
        selectedTagIds={selectedTagIds}
        onChange={setSelectedTagIds}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          value={price}
          onChange={setPrice}
          placeholder="0.00"
          type="number"
          required
        />
        <Input
          label="Live Preview"
          value={livePreview}
          onChange={setLivePreview}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      {/* Continue Button - No longer submits to backend */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Continue
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
