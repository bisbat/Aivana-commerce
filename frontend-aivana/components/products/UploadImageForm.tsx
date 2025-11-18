'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ProductImages } from '@/lib/types/product';

interface UploadImageFormProps {
  onPublish: (data: ProductImages) => void;
  onBack: () => void;
}

export const UploadImageForm: React.FC<UploadImageFormProps> = ({ 
  productId, 
  onPublish, 
  onBack 
}) => {
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
    if (detailImages.length + files.length > 8) {
      setError('You can upload maximum 8 detail images');
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

    // Validate hero image
    if (!heroImage) {
      setError("Hero image is required");
      return;
    }

    // Validate product ID
    if (!productId) {
      setError("Missing product ID");
      return;
    }

    // Pass data to parent
    onPublish({
      heroImage,
      detailImages
    });
  };

  // ... rest of your component (JSX) stays exactly the same ...
  
  return (
    <div className="space-y-8">
      {/* All your existing JSX */}
    </div>
  );
};