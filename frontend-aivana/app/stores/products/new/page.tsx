"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadFileForm } from "@/components/products/UploadFileForm";
import { ProductForm } from "@/components/products/ProductForm";
import { UploadImageForm } from "@/components/products/UploadImageForm";
import { UploadImageFormData } from "@/lib/types/formCreateProduct/UploadImageFormData";
import { UploadFileFormData } from "@/lib/types/formCreateProduct/UploadFileFormData";
import { ProductInformationFormData } from "@/lib/types/formCreateProduct/ProductInformationFormData";
import { createCompleteProduct } from "@/lib/actions/product.actions";
import { Loader, CheckCircle, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

// Import storage helpers
import {
  saveFormStep,
  loadFormStep,
  saveCurrentStep,
  loadCurrentStep,
  clearAllFormData
} from "@/lib/utils/formStorage";

export default function AddProductPage() {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string | null>(null);

  // Track current step
  const [currentStep, setCurrentStep] = useState(1);

  // Store data from each step
  const [uploadData, setUploadData] = useState<UploadFileFormData | null>(null);
  const [productData, setProductData] = useState<ProductInformationFormData | null>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    async function initializePage() {
      try {
        setIsLoadingData(true);

        // Fetch user data
        const user = await getCurrentUser();
        setSellerId(user?.sellerId || null);

        // Load saved form data
        const [savedStep1, savedStep2, savedCurrentStep] = await Promise.all([
          loadFormStep(1),
          loadFormStep(2),
          loadCurrentStep()
        ]);

        // Restore saved data if exists
        if (savedStep1) {
          setUploadData(savedStep1);
          console.log('✅ Restored Step 1 data');
        }

        if (savedStep2) {
          setProductData(savedStep2);
          console.log('✅ Restored Step 2 data');
        }

        // Restore current step
        setCurrentStep(savedCurrentStep);

      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }

    initializePage();
  }, []);

  // Save current step whenever it changes
  useEffect(() => {
    if (!isLoadingData) {
      saveCurrentStep(currentStep);
    }
  }, [currentStep, isLoadingData]);

  // Step 1 → Step 2
  const handleUploadNext = async (data: UploadFileFormData) => {
    try {
      console.log("✅ Step 1 completed:", data);

      // Save to storage
      await saveFormStep(1, data);

      // Update state
      setUploadData(data);
      setCurrentStep(2);
    } catch (error) {
      setError('Failed to save progress. Please try again.');
      console.error('Save error:', error);
    }
  };

  // Step 2 → Step 3
  const handleProductNext = async (data: ProductInformationFormData) => {
    try {
      console.log("✅ Step 2 completed:", data);

      // Save to storage
      await saveFormStep(2, data);

      // Update state
      setProductData(data);
      setCurrentStep(3);
    } catch (error) {
      setError('Failed to save progress. Please try again.');
      console.error('Save error:', error);
    }
  };

  // Step 3 → Submit everything
  const handlePublish = async (imageData: UploadImageFormData) => {
    if (!uploadData || !productData) {
      setError("Missing data from previous steps");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("📤 Submitting complete product...");

      // Submit to backend
      const createdProduct = await createCompleteProduct(
        uploadData,
        productData,
        imageData
      );

      console.log("✅ Product created:", createdProduct);

      // Clear saved form data after successful publish
      await clearAllFormData();

      // Show success
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/stores");
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      console.error("❌ Error:", err);
    } finally {
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

  // Loading screen
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <Loader className="animate-spin text-[var(--primary)] mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-white text-2xl font-bold mb-2">
            Product Published!
          </h2>
          <p className="text-slate-400">Redirecting to your products...</p>
        </div>
      </div>
    );
  }

  // Submitting screen
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <Loader className="animate-spin text-[var(--primary)] mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Publishing your product...</p>
          <p className="text-slate-400 text-sm mt-2">
            Uploading files, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
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
          {currentStep === 1 && (
            <UploadFileForm
              onNext={handleUploadNext}
              initialData={
                uploadData
                  ? {
                    productType: uploadData.productType,
                    keywords: uploadData.keywords,
                  }
                  : undefined
              }
            />
          )}
          {currentStep === 2 && uploadData && (
            <ProductForm
              sellerId={sellerId ?? ""}
              uploadData={uploadData}
              initialData={productData ?? undefined}
              onNext={handleProductNext}
              onBack={handleBackToStep1}
            />
          )}
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