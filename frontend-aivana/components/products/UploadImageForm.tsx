'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ProductImages } from '@/lib/types/product';

interface UploadImageFormProps {
  productId: string; // ⭐ Received from parent
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

  // ... all your existing handlers (handleHeroImageChange, handleDetailImagesChange, removeDetailImage) ...

  // ✅ Fixed handlePublish
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