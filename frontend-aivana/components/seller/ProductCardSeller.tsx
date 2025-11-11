import React from "react";
import { Edit2 } from "lucide-react";
import { Product } from "@/lib/api/types/product";

interface ProductCardSellerProps {
  product: Product;
  onEdit?: (productId: number) => void;
}

const ProductCardSeller: React.FC<ProductCardSellerProps> = ({ product, onEdit }) => {
  return (
    <div className="border rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 h-70 w-full overflow-hidden bg-[var(--linne-purple)]">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        {product.hero_image ? (
          <img 
            src={product.hero_image} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback gradient if no image
          <div className="w-full h-full" />
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col justify-between h-22">
        <h3
          className="text-base font-semibold line-clamp-2 mb-1 truncate"
          title={product.title}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            {product.price.toLocaleString('th-TH')}฿
          </span>

          <button
            type="button"
            aria-label="Edit product"
            title="Edit"
            onClick={() => onEdit?.(product.id)}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150 bg-[var(--linne-purple-hover)] hover:bg-[var(--linne-purple-hover-2)] cursor-pointer"
          >
            <img src="/icon/edit.svg" alt="" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProductCardSeller };