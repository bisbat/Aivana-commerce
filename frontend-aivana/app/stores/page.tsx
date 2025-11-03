"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProductCartSeller } from "@/components/ui/seller/ProductCartSeller";
import { productAPI } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Loader, AlertCircle, Package } from "lucide-react";

export default function StorePage() {
  const router = useRouter();
  const pathname = usePathname();

  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array = run once on mount

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call your NestJS backend
      const data = await productAPI.getAll();
      setProducts(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEditProduct = (productId: number) => {
    router.push(`stores/products/edit/${productId}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        storeName="Bisbat Sae-kow"
        currentPath={pathname}
        onAddProductClick={() => router.push("stores/products/new")}
      />

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Avatar Section */}
        <div className="avatar-section w-full flex justify-end mb-6">
          <div className="rounded-full w-16 h-16 overflow-hidden border-2 border-gray-300 bg-slate-700" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-purple-600 mb-4" size={48} />
            <p className="text-slate-600 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="text-red-600" size={24} />
                <h3 className="text-red-900 font-bold">Error Loading Products</h3>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="text-slate-400 mb-4" size={64} />
            <h3 className="text-slate-700 font-bold text-xl mb-2">No Products Yet</h3>
            <p className="text-slate-500 text-sm mb-6">Start by adding your first product</p>
            <button
              onClick={() => router.push("/products/new")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCartSeller
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}