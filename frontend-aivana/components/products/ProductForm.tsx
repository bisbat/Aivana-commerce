'use client';

import React, { useState } from 'react';
import { productAPI, ProductData } from '@/lib/api/products';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Dropdown';
import { TagInput } from '@/components/ui/TagInput';
import { FeatureInput } from '@/components/ui/FeatureInput';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

export const ProductForm: React.FC = () => {
  // Form state
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
    // Reset states
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare data
      const formData: ProductData = {
        productName,
        blurb,
        category,
        description,
        features: features.filter(f => f.trim() !== ''),
        compatibility,
        tags,
        price,
        howToUse,
        livePreview
      };

      // Validate required fields
      if (!formData.productName || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Send to backend
      const response = await productAPI.create(formData);

      // Success!
      setSuccess(true);
      console.log('Product created:', response);

      // Optional: Reset form or redirect
      // resetForm();
      // router.push('/products/success');

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

      {/* Form fields... (same as before) */}
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
        label="Compatibility"
        value={compatibility}
        onChange={setCompatibility}
        placeholder="Compatible devices..."
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

      <Textarea
        label="How to use"
        value={howToUse}
        onChange={setHowToUse}
        placeholder="Instructions..."
        rows={4}
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
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};