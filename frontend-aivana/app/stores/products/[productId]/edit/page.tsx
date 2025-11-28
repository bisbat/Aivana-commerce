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
import EditProductHeroImage from './EditProductHeroImage';
import EditProductFile from './EditProductFile';
import BackButton from '../BackButton';

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
  
  // States for handling hero image
  const [currentHeroImage, setCurrentHeroImage] = useState<string | null>(null);
  const [newHeroImageFile, setNewHeroImageFile] = useState<File | null>(null);
  
  // States for handling product file
  const [currentProductFile, setCurrentProductFile] = useState<string | null>(null);
  const [newProductFile, setNewProductFile] = useState<File | null>(null);

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
      setInstallation_guide(productData.installationGuide || '');
      setCompatibility(productData.compatibility || []);
      setPrice(productData.price || '');
      setLivePreview(productData.previewUrl || '');
      setFeatures(productData.features || []);
      setCategoryId(productData.category?.id?.toString() || '');
      setSelectedTagIds(productData.tags?.map(tag => Number(tag.id)) || []);
      setDetailImages(productData.detailImages || []);
      setCurrentHeroImage(productData.heroImageUrl || null);
      setCurrentProductFile(productData.uploadedFilePath || null);
      
    }
  }, [productData]);

  if (loading) return <div>Loading...</div>;

  // Handler for adding new image files
  const handleAddImages = (files: File[]) => {
    setNewImageFiles(prev => [...prev, ...files]);
  };

  // Handler for removing existing image
  const handleDeleteImage = async (imageId: number) => {
    try {
      // เรียก API เพื่อลบรูปจริงๆ
      await deleteProductImageAction(imageId);
      
      // อัปเดต UI
      setDetailImages(prev => prev.filter(img => img.imageId !== imageId));
      
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

  // Handler for hero image change
  const handleHeroImageChange = (file: File | null) => {
    setNewHeroImageFile(file);
  };

  // Handler for removing hero image
  const handleRemoveHeroImage = () => {
    setCurrentHeroImage(null);
    setNewHeroImageFile(null);
  };

  // Handler for product file change
  const handleProductFileChange = (file: File | null) => {
    setNewProductFile(file);
  };

  // Handler for removing product file
  const handleRemoveProductFile = () => {
    setCurrentProductFile(null);
    setNewProductFile(null);
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
      
      // Add new detail image files
      newImageFiles.forEach((file, index) => {
        formData.append('detailImages', file);
      });

      // Add hero image file if changed
      if (newHeroImageFile) {
        formData.append('heroImage', newHeroImageFile);
      }

      // Add product file if changed
      if (newProductFile) {
        formData.append('productFile', newProductFile);
      }

      console.log('Updated Product Data:', {
        name, blurb, description, installation_guide,
        compatibility, price, livePreview, features,
        categoryId, selectedTagIds, 
        newDetailImages: newImageFiles.length,
        hasNewHeroImage: !!newHeroImageFile,
        hasNewProductFile: !!newProductFile
      });

      await updateProductAction(productId, formData);
      
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
      <BackButton/>
      <h1 className='text-3xl font-bold text-primary mb-4'>Edit page</h1>

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

