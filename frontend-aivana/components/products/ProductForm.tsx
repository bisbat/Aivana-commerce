'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Dropdown';
import { TagInput } from '@/components/ui/TagInput';
import { FeatureInput } from '@/components/ui/FeatureInput';

// Type definition for product data
export interface ProductData {
  productName: string;
  blurb: string;
  category: string;
  description: string;
  features: string[];
  compatibility: string;
  tags: string[];
  price: string;
  howToUse: string;
  livePreview: string;
}

interface ProductFormProps {
  onContinue: (data: ProductData) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onContinue }) => {
  // State for all form fields
  const [productName, setProductName] = useState('');
  const [blurb, setBlurb] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [compatibility, setCompatibility] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [livePreview, setLivePreview] = useState('');

  // Category options
  const categories = [
    'Web Templates',
    'UI Kits (With Code)',
    'UI Components',
    'Figma UI Kits',
    'Sketch UI Kits',
    'Adobe XD UI Kits'
  ];

  // Handle form submission
  const handleContinue = () => {
    const formData: ProductData = {
      productName,
      blurb,
      category,
      description,
      features: features.filter(f => f.trim() !== ''), // Remove empty features
      compatibility,
      tags,
      price,
      howToUse,
      livePreview
    };

    onContinue(formData);
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            1
          </div>
          <span className="text-purple-400 font-medium">Product Information</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-slate-400 font-medium">Product Images</span>
        </div>
      </div>

      {/* Form fields */}
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
        placeholder="Detailed description of your product..."
        rows={5}
      />

      <FeatureInput
        features={features}
        onChange={setFeatures}
        maxFeatures={6}
      />

      <Textarea
        label="Compatibility"
        value={compatibility}
        onChange={setCompatibility}
        placeholder="List compatible devices or systems..."
        rows={4}
      />

      <TagInput
        label="Tags"
        tags={tags}
        onChange={setTags}
        placeholder="Type a tag and press Enter (e.g., Vue, React, Figma)"
      />

      <Input
        label="Price"
        value={price}
        onChange={setPrice}
        placeholder="0.00"
        type="number"
      />

      <Textarea
        label="How to use"
        value={howToUse}
        onChange={setHowToUse}
        placeholder="Instructions on how to use this product..."
        rows={4}
      />

      <Input
        label="Live Preview"
        value={livePreview}
        onChange={setLivePreview}
        placeholder="https://example.com/preview"
        type="url"
      />

      {/* Continue button */}
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