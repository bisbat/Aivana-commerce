'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadImageData } from '@/lib/api/types/product';

interface UploadImageFormProps {
  onPublish: (data: UploadImageData) => void;
  onBack: () => void;
}

export const UploadImageForm: React.FC<UploadImageFormProps> = ({ onPublish, onBack }) => {
  // State
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Refs for file inputs
  const heroInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);

  // Handle hero image upload
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, JPEG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Hero image must be less than 5MB');
        return;
      }

      setHeroImage(file);
      setError(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle detail images upload
  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check total number of images (max 10)
    if (detailImages.length + files.length > 10) {
      setError('You can upload maximum 10 detail images');
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('All files must be images (JPG, PNG, JPEG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB');
        return;
      }
    }

    setError(null);

    // Add to existing images
    setDetailImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDetailImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove detail image
  const removeDetailImage = (index: number) => {
    setDetailImages(prev => prev.filter((_, i) => i !== index));
    setDetailImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle publish
  const handlePublish = () => {
    setError(null);

    // Validate hero image is required
    if (!heroImage) {
      setError('Hero image is required');
      return;
    }

    // Pass data to parent
    onPublish({
      heroImage,
      detailImages
    });
  };

  return (
    <div className="space-y-8">
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
          
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <span className="text-green-400 text-sm font-medium">Product Information</span>
          
          <div className="h-px w-12 bg-slate-700" />
          
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            3
          </div>
          <span className="text-purple-400 text-sm font-medium">Product Images</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Hero Image Section */}
      <div className="space-y-3">
        <label className="block text-white font-medium">
          Hero section <span className="text-red-400">*</span>
        </label>
        <p className="text-slate-400 text-sm">Main product image (required)</p>

        {/* Hidden file input */}
        <input
          ref={heroInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleHeroImageChange}
          className="hidden"
        />

        {/* Upload Area or Preview */}
        {heroImagePreview ? (
          <div className="relative border-2 border-dashed border-slate-600 rounded-lg p-4">
            <img
              src={heroImagePreview}
              alt="Hero preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setHeroImage(null);
                setHeroImagePreview(null);
              }}
              className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => heroInputRef.current?.click()}
              className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div
            onClick={() => heroInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all"
          >
            <ImageIcon className="mx-auto text-purple-400 mb-4" size={48} />
            <p className="text-white mb-2">Drop your image here, or <span className="text-purple-400">brown</span></p>
            <p className="text-slate-400 text-sm">Supports: JPG, JPEG</p>
          </div>
        )}
      </div>

      {/* Detail Images Section */}
      <div className="space-y-3">
        <label className="block text-white font-medium">
          Detail images
        </label>
        <p className="text-slate-400 text-sm">Upload up to 10 images showing product details</p>

        {/* Hidden file input (multiple) */}
        <input
          ref={detailInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          onChange={handleDetailImagesChange}
          className="hidden"
        />

        {/* Upload Area */}
        <div
          onClick={() => detailInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all"
        >
          <Upload className="mx-auto text-purple-400 mb-3" size={40} />
          <p className="text-white mb-1">Drop your image here, or <span className="text-purple-400">brown</span></p>
          <p className="text-slate-400 text-sm">Supports: JPG, JPEG</p>
        </div>

        {/* Detail Images Grid */}
        {detailImagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {detailImagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Detail ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border-2 border-slate-700"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDetailImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
                {/* Lock icon overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-800/90 p-2 rounded-full">
                    <ImageIcon size={20} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {detailImages.length > 0 && (
          <p className="text-slate-400 text-sm mt-2">
            {detailImages.length} / 10 images uploaded
          </p>
        )}
      </div>

      {/* Publish Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handlePublish}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Publish →
        </button>
      </div>
    </div>
  );
};