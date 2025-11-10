'use client';

import React, { useState, useEffect } from 'react';
import { productAPI } from '@/lib/api/products';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Loader, AlertCircle } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'price'>('latest');

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    // Sort by created_at (latest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-purple-400">เลือกซื้อ</h2>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'price')}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="latest">คำสั่งบนแถง</option>
            <option value="price">ราคา: ต่ำ - สูง</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-purple-500" size={48} />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              ลองอีกครั้ง
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">ไม่พบสินค้า</p>
          </div>
        )}
      </div>
    </section>
  );
};