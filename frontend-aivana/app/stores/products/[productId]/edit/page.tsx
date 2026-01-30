"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductByIdAction,
  updateProductAction,
  deleteProductImageAction,
} from "@/lib/actions/product.actions";
import { Product } from "@/lib/types/product/product";
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
  tagIds: string; // JSON string of number[]
  price: string;
  previewUrl: string;
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
  const [price, setPrice] = useState("");
  const [previewUrl, setpreviewUrl] = useState("");

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
      setSelectedTagIds(product.tags.map((tag) => parseInt(tag.id)));
      setPrice(product.price.toString());
      setpreviewUrl(product.previewUrl || "");
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
      tagIds: JSON.stringify(selectedTagIds),
      price: price,
      previewUrl,
      files: {
        heroImage: newHeroImageFile,
        productFile: newProductFile,
        detailImages: newImageFiles,
      },
    };
    await updateProductAction(productId, updatedProductData);
    router.push(`/stores/products/${productId}`);
  };

  return (
    <div>
      <BackButton productId={productId} />
      <h1 className="text-3xl font-bold text-primary mb-4">Edit page</h1>

      <form onSubmit={handleSubmit}>
        <Input
          label="Product Name"
          value={name}
          onChange={setName}
          placeholder="Enter product name"
          required
        />
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

        <Textarea
          label="Product Description"
          value={description}
          onChange={setDescription}
          placeholder="Detailed description..."
          rows={5}
        />

        <DynamicTextListInput
          label="Features"
          value={features}
          onChange={setFeatures}
          placeholder="Feature เช่น AI Chat, Image Generator"
          maxItems={6}
          required
        />

        <InstallationGuideInput
          value={installationGuide}
          onChange={setInstallationGuide}
        />

        <DynamicTextListInput
          label="Compatibility"
          value={compatibility}
          onChange={setCompatibility}
          placeholder="เช่น Windows, macOS, Chrome"
          maxItems={6}
        />

        <MultiSelectTag
          label="Tags"
          tags={tags}
          selectedTagIds={selectedTagIds}
          onChange={setSelectedTagIds}
        />

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
          value={previewUrl}
          onChange={setpreviewUrl}
          placeholder="https://example.com"
          type="url"
        />

        {/* Product File Management */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product File
          </label>
          <EditProductFile
            currentFile={currentProductFile}
            newFile={newProductFile}
            onFileChange={handleProductFileChange}
            onRemoveFile={handleRemoveProductFile}
          />
        </div>

        {/* Hero Image Management */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image
          </label>
          <EditProductHeroImage
            currentImage={currentHeroImage}
            newImageFile={newHeroImageFile}
            onImageChange={handleHeroImageChange}
            onRemoveImage={handleRemoveHeroImage}
          />
        </div>

        {/* Detail Images Management */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Detail Images
          </label>
          <EditProductImages
            existingImages={detailImages}
            newImageFiles={newImageFiles}
            onAddImages={handleAddImages}
            onDeleteImage={handleDeleteImage}
            onRemoveNewImage={handleRemoveNewImage}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
