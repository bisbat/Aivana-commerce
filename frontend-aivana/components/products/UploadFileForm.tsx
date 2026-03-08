'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { UploadFileFormData } from '@/lib/types/formCreateProduct/UploadFileFormData';
import { saveFormStep } from "@/lib/utils/formStorage";
import { extractMetadataFromUpload } from "@/lib/actions/metadata-extraction.actions";
import type { ExtractedMetadata } from "@/lib/types/extracted-metadata";


interface UploadFileFormProps {
  onNext: (data: UploadFileFormData) => void;
  initialData?: {
    productType: 'UI Kit' | 'frontend-template' | 'backend-template';
    keywords: string;
  };
}

export const UploadFileForm: React.FC<UploadFileFormProps> = ({ onNext, initialData }) => {
  // State for form fields
  const [productType, setProductType] = useState<'UI Kit' | 'frontend-template' | 'backend-template' | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Reference to file input for triggering click
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapProductTypeToCategory = (
    type: 'UI Kit' | 'frontend-template' | 'backend-template'
  ): "ui-kit" | "frontend-template" | "backend-template" => {

    if (type === "UI Kit") return "ui-kit";
    if (type === "frontend-template") return "frontend-template";
    return "backend-template";
  };

  useEffect(() => {
    if (!initialData) return;

    setProductType(initialData.productType);
    setKeywords(initialData.keywords);
  }, [initialData]);

  useEffect(() => {
    if (!productType && !file && !keywords) return;

    saveFormStep(1, {
      productType,
      file,
      keywords,
    });
  }, [productType, file, keywords]);


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
  const handleSubmit = async (useAI: boolean) => {
    setError(null);

    if (!productType) {
      setError("กรุณาเลือกประเภทโพสต์");
      return;
    }

    if (!file) {
      setError("กรุณาอัปโหลดไฟล์");
      return;
    }

    if (!keywords.trim()) {
      setError("กรุณาระบุหัวข้อ");
      return;
    }

    try {
      let metadata: ExtractedMetadata | undefined = undefined;

      // 🔥 only call AI if user choose it
      if (useAI) {
        setIsAnalyzing(true);

        const category = mapProductTypeToCategory(
          productType as 'UI Kit' | 'frontend-template' | 'backend-template'
        );

        metadata = await extractMetadataFromUpload(
          category,
          file
        );

        console.log("🤖 AI metadata:", metadata);
      }

      onNext({
        productType: productType as 'UI Kit' | 'frontend-template' | 'backend-template',
        file,
        keywords,
        metadata,
        useAI
      });

    } catch (err) {
      console.error(err);
      setError("AI analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
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
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setProductType('UI Kit')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${productType === 'UI Kit'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            UI kits
          </button>
          <button
            type="button"
            onClick={() => setProductType('frontend-template')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${productType === 'frontend-template'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            Frontend Template
          </button>
          <button
            type="button"
            onClick={() => setProductType('backend-template')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${productType === 'backend-template'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            Backend Template
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

      {/* Upload Warning */}
      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 text-sm">
        <p className="text-yellow-400 font-medium mb-1">
          ⚠️ คำแนะนำก่อนอัปโหลด
        </p>
        <p className="text-yellow-300">
          กรุณาลบ <span className="font-mono text-yellow-200">node_modules</span>
          ออกจากโปรเจกต์ก่อน zip ไฟล์ เพื่อให้การอัปโหลดเร็วขึ้นและช่วยให้ AI วิเคราะห์ไฟล์ได้แม่นยำขึ้น
        </p>
      </div>


      {/* AI Generate Button */}
      <button
        disabled={isAnalyzing}
        onClick={() => handleSubmit(true)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isAnalyzing ? "กำลังวิเคราะห์ไฟล์..." : "⚡ วิเคราะห์ไฟล์ด้วย AI (แนะนำ)"}
      </button>


      {/* Skip AI Button */}
      <button
        onClick={() => handleSubmit(false)}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-medium transition-colors"
      >
        ดำเนินการต่อโดยไม่ใช้ AI
      </button>
    </div>
  );
};