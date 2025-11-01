import React, { useState } from "react";
import { Edit2, Heart, ShoppingCart, Star } from "lucide-react";

const ProductCartSeller = () => {
  return (
    <div className="border rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 h-70 w-full overflow-hidden bg-[var(--linne-purple)]">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden"></div>

      {/* Content Section */}
      <div className="p-3 flex flex-col justify-between h-22">
        <h3
          className="text-base font-semibold line-clamp-2 mb-1 truncate"
          title="ชุด UI สำหรับ Mobile Banking App"
        >
          ชุด UI สำหรับ Mobile Banking App
        </h3>

        <div
          className="flex items-center justify-between
        "
        >
          <span className="text-xl font-bold">1,500฿</span>

          <button
            type="button"
            aria-label="Edit product"
            title="Edit"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150 bg-[var(--linne-purple-hover)] 
            hover:bg-[var(--linne-purple-hover-2)] cursor-pointer"
          >
            <img src="/icon/edit.svg" alt="" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProductCartSeller };
