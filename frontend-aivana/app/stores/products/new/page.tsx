'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter, usePathname } from 'next/navigation';


export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();

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
        <h1>Add Product Page</h1>
        {/* Your product form will go here */}
      </main>
    </div>
  );
}