'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadFileForm } from '@/components/products/UploadFileForm';
import { ProductForm } from '@/components/products/ProductForm';
import { UploadImageForm } from '@/components/products/UploadImageForm';
import { 
  UploadFileFormData, 
  ProductInformationForm,
  ProductImages
} from '@/lib/types/product';
import { 
  createProductMetadata,
  uploadProductFile,
  uploadHeroImage,
  uploadDetailImages
} from '@/lib/actions/product.actions';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();

  // Track current step (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Store data from each step
  const [uploadData, setUploadData] = useState<UploadFileFormData | null>(null);
  const [productData, setProductData] = useState<ProductInformationForm | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  // Step 1 → Step 2
  const handleUploadNext = (data: UploadFileFormData) => {
    console.log('✅ Step 1 completed:', data);
    setUploadData(data);
    setCurrentStep(2);
  };

  // Step 2 → Create Product Metadata → Step 3
  const handleProductNext = async (data: ProductInformationForm) => {
    console.log('✅ Step 2 completed:', data);
    setProductData(data);

    // Create product metadata FIRST before moving to step 3
    setIsSubmitting(true);
    setError(null);
    setProgressMessage('Creating product...');

    try {
      // 1️⃣ Create product in database
      const createdProduct = await createProductMetadata(data);
      const productId = createdProduct.id;
      
      console.log('✅ Product created with ID:', productId);
      setCreatedProductId(productId);

      // 2️⃣ Upload product file if exists
      if (uploadData?.file) {
        setProgressMessage('Uploading product file...');
        await uploadProductFile(productId, uploadData.file);
        console.log('✅ Product file uploaded');
      }

      // Move to Step 3
      setCurrentStep(3);
      setIsSubmitting(false);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('❌ Error:', err);
      setIsSubmitting(false);
    }
  };

  // Step 3 → Upload Images → Complete
  const handlePublish = async (imageData: ProductImages) => {
    if (!createdProductId) {
      setError('Product ID not found. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 3️⃣ Upload hero image
      if (imageData.heroImage) {
        setProgressMessage('Uploading hero image...');
        await uploadHeroImage(createdProductId, imageData.heroImage);
        console.log('✅ Hero image uploaded');
      }

      // 4️⃣ Upload detail images
      if (imageData.detailImages.length > 0) {
        setProgressMessage(`Uploading ${imageData.detailImages.length} detail images...`);
        await uploadDetailImages(createdProductId, imageData.detailImages);
        console.log('✅ Detail images uploaded');
      }

      // ✅ Success!
      setSuccess(true);
      setProgressMessage('Product published successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/stores/products');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setError(errorMessage);
      console.error('❌ Error:', err);
      setIsSubmitting(false);
    }
  };

  // Back button handlers
  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
    setError(null);
  };

  // Show success screen
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-white text-2xl font-bold mb-2">Product Published!</h2>
          <p className="text-slate-400">Redirecting to your products...</p>
        </div>
      </div>
    );
  }

  // Show loading screen
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <Loader className="animate-spin text-[var(--primary)] mx-auto mb-4" size={48} />
          <p className="text-white text-lg">{progressMessage}</p>
          <p className="text-slate-400 text-sm mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Global Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-red-400 font-bold mb-1">Error</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 text-xl leading-none"
              >
                ✕
              </button>
            </div>
          )}

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
          {currentStep === 3 && createdProductId && (
            <UploadImageForm 
              productId={createdProductId}
              onPublish={handlePublish}
              onBack={handleBackToStep2}
            />
          )}
        </div>
      </main>
    </div>
  );
}