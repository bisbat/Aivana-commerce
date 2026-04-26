"use client";

import Link from "next/link";
import { Product } from "@/lib/types/product/Product";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";

interface ProductCardProps {
  product: Product;
}

const getCategoryDisplayName = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    "ui-kit": "UI Kit",
    "frontend-template": "Frontend Template",
    "backend-template": "Backend Template",
  };
  return categoryMap[categoryName] || categoryName;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 mb-3">
          {product.heroImageUrl ? (
            <img
              src={product.heroImageUrl}
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
            <span>@{product.seller?.username}</span>
            {product.category && (
              <>
                <span>•</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs">
                  {getCategoryDisplayName(product.category.name)}
                </span>
              </>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">
              {formatPriceWithCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
