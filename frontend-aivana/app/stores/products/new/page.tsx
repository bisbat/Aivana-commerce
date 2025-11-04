'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { UploadFileForm } from '@/components/products/UploadFileForm';
import { ProductForm } from '@/components/products/ProductForm';
import { UploadFileData } from '@/types/product';

export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Track current step (1 = Upload File, 2 = Product Info)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Store data from Step 1
  const [uploadData, setUploadData] = useState<UploadFileData | null>(null);

  // Handle Step 1 completion
  const handleUploadNext = (data: UploadFileData) => {
    setUploadData(data);
    setCurrentStep(2);
  };

  // Handle going back to Step 1
  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        storeName="Store Name"
        currentPath={pathname}
        onAddProductClick={() => router.push('/stores/products/new')}
      />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Conditional rendering based on current step */}
          {currentStep === 1 && (
            <UploadFileForm onNext={handleUploadNext} />
          )}

          {currentStep === 2 && uploadData && (
            <ProductForm 
              uploadData={uploadData} 
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </div>
  );
}