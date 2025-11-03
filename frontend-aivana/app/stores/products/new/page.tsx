'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { ProductForm, ProductData } from '@/components/products/ProductForm';


export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleContinue = (data: ProductData) => {
    console.log('Product data:', data);
    // TODO: Save to database or move to next step
    alert('Product data collected! Check console.');
  };
  
  return (
    <div className="flex">
      {/* Use your reusable Sidebar */}
      <Sidebar 
        storeName="Bisbat Sae-kow"
        currentPath={pathname}
        onAddProductClick={() => router.push('/products/new')}
      />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Add Product</h1>
          <p className="text-slate-400 mt-2">Step 1 - Product Information</p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-lg p-8">
          <ProductForm onContinue={handleContinue} />
        </div>
      </main>
    </div>
  );
}
