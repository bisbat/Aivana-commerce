import React from "react";
import { Edit, EyeOff, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { Product } from "@/lib/types/product/Product";
import { useRouter } from "next/navigation";

interface ProductCardSellerProps {
  product: Product;
  onEdit?: (productId: number) => void;
}

const ProductCardSeller: React.FC<ProductCardSellerProps> = ({
  product,
  onEdit,
}) => {
  const isDeleted = product.isDeleted;
  const isHidden = product.isHidden;

  const router = useRouter();

  return (
    <Link href={`/stores/products/${product.id}`}>
      <div className="rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 w-full overflow-hidden bg-[var(--linne-purple)] relative">
        <div className="relative h-48  overflow-hidden">
          {product.heroImageUrl ? (
            <img
              src={product.heroImageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${isDeleted
                  ? "grayscale opacity-50"
                  : isHidden
                    ? "opacity-70"
                    : ""
                }`}
            />
          ) : (
            <div
              className={`w-full h-full ${isDeleted ? "opacity-50" : isHidden ? "opacity-70" : ""}`}
            />
          )}

          {isDeleted ? (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-lg">
              <AlertTriangle size={10} className="stroke-[3px]" />
              ยกเลิกการขายแล้ว
            </div>
          ) : isHidden ? (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-lg">
              <EyeOff size={10} className="stroke-[3px]" />
              ถูกซ่อนชั่วคราว
            </div>
          ) : null}
          {(isDeleted || isHidden) && (
            <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"></div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1 gap-2">

          <h3
            className={`text-base font-semibold line-clamp-2 min-h-[3rem] ${isDeleted ? "text-slate-500" : isHidden ? "text-slate-400" : ""
              }`}
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between">
            <span
              className={`text-xl font-bold ${isDeleted ? "text-slate-500" : ""
                }`}
            >
              {formatPriceWithCurrency(product.price)}
            </span>

            {!isDeleted && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); 
                  router.push(`/stores/products/${product.id}/edit`);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--linne-purple-hover)] hover:bg-[var(--linne-purple-hover-2)] transition"
              >
                <Edit size={16} />
              </button>
            )}
          </div>

          {isHidden && !isDeleted ? (
            <p className="text-[10px] text-orange-400/80 min-h-[1rem]">
              สินค้าถูกซ่อนจาก Marketplace ชั่วคราว
            </p>
          ) : (
            <div className="min-h-[1rem]" />
          )}
        </div>
      </div>
    </Link>
  );
};

export { ProductCardSeller };
