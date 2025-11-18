'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Convert price string to number for display
  const price = parseFloat(product.price);

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 mb-3">
          {product.hero_image_url ? (
            <img
              src={product.hero_image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-600 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>


        {/* Product Info */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-white font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>

          {/* Creator & Category */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>{product.owner?.first_name || 'Unknown'}</span>
            {product.category && (
              <>
                <span>•</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs">
                  {product.category.name}
                </span>
              </>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">
              {price}฿
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};