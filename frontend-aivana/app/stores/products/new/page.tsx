'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { UploadFileForm } from '@/components/products/UploadFileForm';
import { ProductForm, ProductFormData } from '@/components/products/ProductForm';
import { UploadImageForm } from '@/components/products/UploadImageForm';
import { productAPI } from '@/lib/api/products';
import { UploadFileData, UploadImageData, ProductData } from '@/lib/api/types/product';
import { Loader } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Track current step (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Store data from each step
  const [uploadData, setUploadData] = useState<UploadFileData | null>(null);
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  
  // UI state for final submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 → Step 2
  const handleUploadNext = (data: UploadFileData) => {
    setUploadData(data);
    setCurrentStep(2);
  };

  // Step 2 → Step 3
  const handleProductNext = (data: ProductFormData) => {
    setProductData(data);
    setCurrentStep(3);
  };

  // Step 3 → Submit to backend
  const handlePublish = async (imageData: UploadImageData) => {
    if (!uploadData || !productData) {
      alert('Missing data from previous steps');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine all data from 3 steps
      const completeData: ProductData = {
        // Step 1
        productType: uploadData.productType,
        file: uploadData.file,
        keywords: uploadData.keywords,
        
        // Step 2
        productName: productData.productName,
        blurb: productData.blurb,
        category: productData.category,
        description: productData.description,
        features: productData.features,
        installationDoc: productData.installationDoc,
        tags: productData.tags,
        price: productData.price,
        livePreview: productData.livePreview,
        
        // Step 3
        heroImage: imageData.heroImage,
        detailImages: imageData.detailImages
      };

      // Send to backend
      const response = await productAPI.create(completeData);
      
      console.log('Product created:', response);
      
      // Success! Redirect to products page
      router.push('/stores/products');
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Back button handlers
  const handleBackToStep1 = () => setCurrentStep(1);
  const handleBackToStep2 = () => setCurrentStep(2);

  // Show loading overlay during submission
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <Loader className="animate-spin text-purple-600 mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Publishing your product...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

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
          {/* Step 1: Upload File */}
          {currentStep === 1 && (
            <UploadFileForm onNext={handleUploadNext} />
          )}

          {/* Step 2: Product Information */}
          {currentStep === 2 && uploadData && (
            <ProductForm 
              uploadData={uploadData}
              onNext={handleProductNext}
              onBack={handleBackToStep1}
            />
          )}

          {/* Step 3: Product Images */}
          {currentStep === 3 && (
            <UploadImageForm 
              onPublish={handlePublish}
              onBack={handleBackToStep2}
            />
          )}
        </div>
      </main>
    </div>
  );
}
