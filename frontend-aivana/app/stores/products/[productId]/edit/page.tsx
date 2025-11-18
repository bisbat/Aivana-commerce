'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductByIdAction, updateProductAction, deleteProductImageAction } from '@/lib/actions/product.actions';
import { Product } from '@/lib/types/product/Product';
import { ProductImages } from '@/lib/types/product/product_images';
import { getAllTagsAction } from '@/lib/actions/tag.actions';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Dropdown';
import { MultiSelectTag } from '@/components/ui/MultiSelectTag';
import { Tag } from '@/lib/types/tag';
import { Category } from '@/lib/types/category';
import { getAllCategories } from '@/lib/actions/category.actions';
import { FeatureInput } from '@/components/ui/FeatureInput';
import { CompatibilityInput } from '@/components/ui/CompatibilityInput';

import EditProductImages from './EditProductImages';

export default function EditProductPage() {
  const params = useParams();
  const productId = String(params.productId);
  const router = useRouter();

  const [productData, setProductData] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [blurb, setBlurb] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [installation_guide, setInstallation_guide] = useState('');
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [livePreview, setLivePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailImages, setDetailImages] = useState<ProductImages[]>([]);
  
  // States for handling detail images
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFormData() {
      try {
        const product: Product = await getProductByIdAction(productId);
        setProductData(product);

        const tags: Tag[] = await getAllTagsAction();
        setTags(tags);

        const categories: Category[] = await getAllCategories();
        setCategories(categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFormData();
  }, [productId]);

  // แยก useEffect สำหรับ populate form เมื่อ productData เปลี่ยน
  useEffect(() => {
    console.log('Populating form with product data:', productData);
    if (productData) {
      setName(productData.name || '');
      setBlurb(productData.blurb || '');
      setDescription(productData.description || '');
      setInstallation_guide(productData.installation_guide || '');
      setCompatibility(productData.compatibility || []);
      setPrice(productData.price || '');
      setLivePreview(productData.preview_url || '');
      setFeatures(productData.features || []);
      setCategoryId(productData.category?.id?.toString() || '');
      setSelectedTagIds(productData.tags?.map(tag => Number(tag.id)) || []);
      setDetailImages(productData.detail_images || []);
      
    }
  }, [productData]);

  if (loading) return <div>Loading...</div>;

  // Handler for adding new image files
  const handleAddImages = (files: File[]) => {
    setNewImageFiles(prev => [...prev, ...files]);
  };

  // Handler for removing existing image
  const handleDeleteImage = async (imageId: string) => {
    try {
      // เรียก API เพื่อลบรูปจริงๆ
      await deleteProductImageAction(imageId);
      
      // อัปเดต UI
      setDetailImages(prev => prev.filter(img => img.image_id !== imageId));
      
      console.log(`Deleted image: ${imageId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      // ควรแสดง error message ให้ user
    }
  };

  // Handler for removing new image file
  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData for handling files
      const formData = new FormData();
      
      // Add text data
      formData.append('name', name);
      formData.append('blurb', blurb);
      formData.append('description', description);
      formData.append('installation_guide', installation_guide);
      formData.append('price', price);
      formData.append('preview_url', livePreview);
      formData.append('categoryId', categoryId);
      
      // Add arrays as JSON strings
      formData.append('compatibility', JSON.stringify(compatibility));
      formData.append('features', JSON.stringify(features));
      formData.append('tagIds', JSON.stringify(selectedTagIds));
      formData.append('deletedImageIds', JSON.stringify(deletedImageIds));
      
      // Add new image files
      newImageFiles.forEach((file, index) => {
        formData.append('newDetailImages', file);
      });

      console.log('Updated Product Data:', {
        name, blurb, description, installation_guide,
        compatibility, price, livePreview, features,
        categoryId, selectedTagIds, 
        newImageFiles: newImageFiles
      });

      // await updateProductAction(productId, formData);
      
      // Redirect to product detail or products list
      // router.push(`/stores/products/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      // ควรแสดง error message ให้ user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => router.back()}>Back</button>
      <h1>Edit page</h1>

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
          options={categories.map(cat => ({
            value: cat.id,
            label: cat.name
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

        <FeatureInput features={features} onChange={setFeatures} />

        <Textarea
          label="Installation Document"
          value={installation_guide}
          onChange={setInstallation_guide}
          placeholder="Installation Document..."
          rows={4}
        />

        <CompatibilityInput compatibility={compatibility} onChange={setCompatibility} />

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
          value={livePreview}
          onChange={setLivePreview}
          placeholder="https://example.com"
          type="url"
        />

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

