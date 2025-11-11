'use client';

import React, { useState } from 'react';
import { UploadFileData } from '@/lib/api/types/product';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Dropdown';
import { TagInput } from '@/components/ui/TagInput';
import { FeatureInput } from '@/components/ui/FeatureInput';

// NEW: This component no longer submits to backend
// It just collects data and passes to next step
interface ProductFormProps {
  uploadData: UploadFileData;
  onNext: (data: ProductFormData) => void; // Changed from onBack
  onBack: () => void;
}

// NEW: Type for data collected in this step only
export interface ProductFormData {
  productName: string;
  blurb: string;
  category: string;
  description: string;
  features: string[];
  installationDoc: string;
  tags: string[];
  price: string;
  livePreview: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  uploadData, 
  onNext, 
  onBack 
}) => {
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

  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Web Templates',
    'UI Kits (With Code)',
    'UI Components',
    'Figma UI Kits',
    'Sketch UI Kits',
    'Adobe XD UI Kits'
  ];

  // Handle continue to next step
  const handleContinue = () => {
    setError(null);

    // Validate required fields
    if (!productName || !category) {
      setError('Please fill in all required fields');
      return;
    }

    // Pass data to parent (page.tsx)
    const formData: ProductFormData = {
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

    onNext(formData);
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
          <span className="text-green-400 text-sm font-medium">Upload File</span>
          
          <div className="h-px w-12 bg-slate-700" />
          
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-purple-400 text-sm font-medium">Product Information</span>
          
          <div className="h-px w-12 bg-slate-700" />
          
          <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold">
            3
          </div>
          <span className="text-slate-400 text-sm font-medium">Product Images</span>
        </div>
      </div>

      {/* Show uploaded file info */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-400 text-sm mb-2">Uploaded file:</p>
        <p className="text-white font-medium">{uploadData.file?.name}</p>
        <p className="text-slate-400 text-sm mt-1">Type: {uploadData.productType}</p>
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