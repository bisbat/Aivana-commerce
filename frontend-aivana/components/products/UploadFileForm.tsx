'use client';

import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { UploadFileData } from '@/types/product';

interface UploadFileFormProps {
  onNext: (data: UploadFileData) => void;
}

export const UploadFileForm: React.FC<UploadFileFormProps> = ({ onNext }) => {
  // State for form fields
  const [productType, setProductType] = useState<'UI Kit' | 'Coded Template' | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reference to file input for triggering click
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  // Handle click on upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = () => {
    setError(null);

    // Validate required fields
    if (!productType) {
      setError('กรุณาเลือกประเภทโพสต์');
      return;
    }

    if (!file) {
      setError('กรุณาอัปโหลดไฟล์');
      return;
    }

    if (!keywords.trim()) {
      setError('กรุณาระบุหัวข้อ');
      return;
    }

    // Pass data to parent
    onNext({
      productType: productType as 'UI Kit' | 'Coded Template',
      file,
      keywords
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          คุณกำลังทำงานอะไรอยู่?
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Product Type Selection */}
      <div className="space-y-3">
        <label className="block text-white font-medium">
          โพสต์นี้เกี่ยวกับหัวข้อใด?
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setProductType('UI Kit')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${
              productType === 'UI Kit'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            UI kits
          </button>
          <button
            type="button"
            onClick={() => setProductType('Coded Template')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${
              productType === 'Coded Template'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Coded Template
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-3">
        <label className="block text-white font-medium">
          อัปโหลดไฟล์สินค้าของคุณ
        </label>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".zip,.rar,.fig,.sketch,.xd"
        />

        {/* Upload Area */}
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-all"
        >
          <Upload className="mx-auto text-purple-400 mb-4" size={48} />
          {file ? (
            <div>
              <p className="text-white font-medium mb-1">{file.name}</p>
              <p className="text-slate-400 text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-purple-400 text-sm mt-2">คลิกเพื่อเปลี่ยนไฟล์</p>
            </div>
          ) : (
            <div>
              <p className="text-white mb-2">วางไฟล์นี่หรือคลิกเพื่ออัพโหลดไฟล์</p>
              <p className="text-slate-400 text-sm">
                รองรับไฟล์: .zip, .rar, .fig, .sketch, .xd
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keywords Input */}
      <div className="space-y-3">
        <label className="block text-white font-medium">
          คุณกำลังโพสต์เกี่ยวกับหัวข้ออะไร?
        </label>
        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="พิมพ์คีย์เวิร์ดไฟล์นี่..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
        />
        <p className="text-slate-400 text-sm">
          ตัวอย่าง: React Dashboard, Admin Template, E-commerce UI
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        ถัดไป →
      </button>
    </div>
  );
};