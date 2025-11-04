'use client';

import React, { useState } from 'react';
import { productAPI } from '@/lib/api/products';
import { ProductData, UploadFileData } from '@/types/product';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Dropdown';
import { TagInput } from '@/components/ui/TagInput';
import { FeatureInput } from '@/components/ui/FeatureInput';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

interface ProductFormProps {
  uploadData: UploadFileData; // Data from Step 1
  onBack: () => void;          // Go back to Step 1
}

export const ProductForm: React.FC<ProductFormProps> = ({ uploadData, onBack }) => {
  // Form state
  const [productName, setProductName] = useState('');
  const [blurb, setBlurb] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [installationDoc, setInstallationDoc] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [livePreview, setLivePreview] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Web Templates',
    'UI Kits (With Code)',
    'UI Components',
    'Figma UI Kits',
    'Sketch UI Kits',
    'Adobe XD UI Kits'
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Combine data from Step 1 and Step 2
      const completeData: ProductData = {
        // From Step 1
        productType: uploadData.productType,
        file: uploadData.file,
        keywords: uploadData.keywords,
        
        // From Step 2
        productName,
        blurb,
        category,
        description,
        features: features.filter(f => f.trim() !== ''),
        installationDoc,
        tags,
        price,
        livePreview
      };

      // Validate required fields
      if (!completeData.productName || !completeData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Send to backend
      const response = await productAPI.create(completeData);

      // Success!
      setSuccess(true);
      console.log('Product created:', response);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
          <span className="text-green-400 font-medium">Upload File</span>
          <div className="h-px flex-1 bg-slate-700" />
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-purple-400 font-medium">Product Information</span>
        </div>
      </div>

      {/* Show uploaded file info */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-400 text-sm mb-2">Uploaded file:</p>
        <p className="text-white font-medium">{uploadData.file?.name}</p>
        <p className="text-slate-400 text-sm mt-1">Type: {uploadData.productType}</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-400" size={24} />
          <div>
            <p className="text-green-400 font-bold">Success!</p>
            <p className="text-green-300 text-sm">Product created successfully</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="text-red-400" size={24} />
          <div>
            <p className="text-red-400 font-bold">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form fields (same as before) */}
      <Input
        label="Product Name"
        value={productName}
        onChange={setProductName}
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
          value={category}
          onChange={setCategory}
          options={categories}
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
        value={installationDoc}
        onChange={setInstallationDoc}
        placeholder="Installation Document..."
        rows={4}
      />

      <TagInput label="Tags" tags={tags} onChange={setTags} />

      <Input
        label="Price"
        value={price}
        onChange={setPrice}
        placeholder="0.00"
        type="number"
      />

      <Input
        label="Live Preview"
        value={livePreview}
        onChange={setLivePreview}
        placeholder="https://example.com"
        type="url"
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Creating...
            </>
          ) : (
            <>
              Continue
              <span>&gt;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};