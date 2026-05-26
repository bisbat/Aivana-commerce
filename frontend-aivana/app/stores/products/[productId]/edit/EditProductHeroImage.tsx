'use client';
import { useState } from 'react';

interface EditProductHeroImageProps {
  currentImage: string | null;
  newImageFile: File | null;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
}

export default function EditProductHeroImage({
  currentImage,
  newImageFile,
  onImageChange,
  onRemoveImage
}: EditProductHeroImageProps) {
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageChange(file);
    }
  };

  const handleRemove = () => {
    onRemoveImage();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  };

  const displayImage = newImageFile 
    ? URL.createObjectURL(newImageFile)
    : currentImage;

  return (
    <div className="space-y-4">
      {displayImage && (
        <div className="relative">
          <div className="relative group w-full max-w-md">
            <img
              src={displayImage}
              alt="Hero image"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                นำภาพออก (Remove Image)
              </button>
            </div>
          </div>
          {newImageFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ ภาพใหม่ถูกเลือก (จะถูกแทนที่ภาพปัจจุบันเมื่อบันทึก)
            </p>
          )}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {displayImage ? 'แทนภาพ hero ปัจจุบัน' : 'เพิ่มภาพ hero'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          แนะนำ: 1200x600px หรือสูงกว่านั้น. รูปแบบที่รองรับ: JPG, PNG, GIF
        </p>
      </div>

      {!displayImage && (
        <div className="w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-sm">ไม่มีภาพ hero ถูกตั้งไว้</p>
            <p className="text-xs">อัปโหลดภาพด้านบน</p>
          </div>
        </div>
      )}
    </div>
  );
}