"use client";

import { Package } from "lucide-react";
import { Product } from "@/lib/types/product/Product";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { getCurrentUser } from "@/lib/auth";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { addToCart } from "@/lib/actions/cart.actions";

interface BundleCardProps {
  goal: string;
  reason: string;
  items: {
    uiKits: Product[];
    frontendTemplates: Product[];
    backendTemplates: Product[];
  };
  onAddAll: (products: Product[]) => void;
}

export default function BundleCard({
  goal,
  reason,
  items,
  onAddAll,
}: BundleCardProps) {
  const router = useRouter();
  const [isAddingAll, setIsAddingAll] = useState(false);

  const allProducts = [
    ...items.uiKits,
    ...items.frontendTemplates,
    ...items.backendTemplates,
  ];

  const handleAddToCart = async (productId: number) => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        showErrorToast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า");
        return;
      }

      await addToCart({ userId: user.id, productId });
      showSuccessToast("เพิ่มสินค้าเข้าตะกร้าสำเร็จ!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message === "PRODUCT_ALREADY_IN_CART"
          ? "สินค้านี้มีอยู่ในตะกร้าแล้ว"
          : "ไม่สามารถเพิ่มสินค้าเข้าตะกร้าได้ กรุณาลองใหม่อีกครั้ง";
      showErrorToast(errorMessage);
    }
  };

  const handleAddAll = async () => {
    setIsAddingAll(true);
    try {
      onAddAll(allProducts);
    } finally {
      setIsAddingAll(false);
    }
  };

  return (
    <div className="bg-[#141130] border border-[#1e1b3d] rounded-2xl p-5 max-w-lg">
      <div className="flex gap-3 items-start mb-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
          <Package size={17} />
        </div>
        <h3 className="text-sm font-bold text-slate-100">{goal}</h3>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed bg-[#0f0d24] border-l-2 border-violet-500/40 rounded-r-lg px-3 py-2.5 mb-4">
        {reason}
      </p>

      <div className="flex flex-col gap-3 mb-4">
        {allProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 bg-[#1a1735] rounded-xl p-3 hover:bg-[#221f45] transition cursor-pointer"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            {product.heroImageUrl && (
              <img
                src={product.heroImageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}

            <div className="flex flex-col flex-1">
              <span className="text-sm text-white font-medium line-clamp-1">
                {product.name}
              </span>
              <span className="text-sm font-semibold text-violet-400 mt-1">
                {formatPriceWithCurrency(product.price)}
              </span>
            </div>

            <button
              className="bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(Number(product.id));
              }}
            >
              + เพิ่ม
            </button>
          </div>
        ))}
      </div>

      <button
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition"
        onClick={handleAddAll}
        disabled={isAddingAll}
      >
        {isAddingAll ? "กำลังเพิ่ม..." : "เพิ่มทั้งหมดลงตะกร้า"}
      </button>
    </div>
  );
}
