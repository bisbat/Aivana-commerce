"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, removeFromCart } from "@/lib/actions/cart.actions";
import { GetCartResponse } from "@/lib/types/cart/GetCart";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { getCurrentUser } from "@/lib/auth";
import { RefObject } from "react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartRef: RefObject<HTMLDivElement | null>;
}

export function CartModal({ isOpen, onClose, cartRef }: CartModalProps) {
  const router = useRouter();
  const [cartData, setCartData] = useState<GetCartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        setCartData(null);
        return;
      }

      const data = await getCart(user.id);
      console.log("Hi there");
      console.log("Fetched cart data:", data);
      setCartData(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      setRemovingItemId(productId);
      const user = await getCurrentUser();
      if (!user) return;

      await removeFromCart(user.id, productId);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("ไม่สามารถลบสินค้าได้");
    } finally {
      setRemovingItemId(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchCart();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const total = (() => {
    if (!cartData?.items?.length) return "0.00";

    const sum = cartData.items.reduce((acc, item) => {
      const price = Number(item.product.price) || 0;
      return acc + price;
    }, 0);

    return Number(sum).toFixed(2);
  })();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - below navbar */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" />

      {/* Modal Container with max-width constraint */}
      <div
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        style={{ top: "15px" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-start justify-end relative">
          <div
            ref={cartRef}
            className="bg-[#1e1b3d] rounded-xl w-3/12 h-auto max-h-[calc(100vh-2rem)] mt-16 overflow-hidden shadow-xl pointer-events-auto flex flex-col fixed border border-[#262549]"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#262549]">
              <p className="text-white font-medium text-base">Shopping Cart</p>
              <p className="text-slate-400 text-sm mt-0.5">
                {cartData?.items.length || 0} items
              </p>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto py-2">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  {cartData?.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="block px-4 py-3 text-sm text-white hover:bg-[#262549] transition-colors cursor-pointer"
                      onClick={() => {
                        router.push(`/products/${item.product.id}`);
                        onClose();
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-14 bg-[#1a1733] rounded overflow-hidden shrink-0">
                          <img
                            src={
                              item.product.heroImageUrl ||
                              "https://via.placeholder.com/200x150"
                            }
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-slate-400 text-xs truncate mt-1">
                            {item.product.seller?.firstName || "Unknown"}
                          </p>
                          <p className="text-white text-sm font-semibold mt-1">
                            {formatPriceWithCurrency(item.product.price)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.product.id);
                          }}
                          disabled={removingItemId === item.product.id}
                          className="p-1.5 hover:bg-[#1e1b3d] rounded transition-colors shrink-0 disabled:opacity-50"
                          aria-label="Remove item"
                        >
                          {removingItemId === item.product.id ? (
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-slate-400"></div>
                          ) : (
                            <svg
                              className="w-3.5 h-3.5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty Cart Message */}
                  {!loading &&
                    (!cartData?.items || cartData.items.length === 0) && (
                      <div className="text-center py-12 px-4">
                        <p className="text-sm text-slate-400">
                          Your cart is empty
                        </p>
                      </div>
                    )}
                </>
              )}
            </div>

            {/* Footer - Total and Checkout */}
            {!loading && cartData && cartData.items.length > 0 && (
              <div className="py-3 border-t border-[#262549]">
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">Total</span>
                    <span className="text-base font-semibold text-white">
                      {formatPriceWithCurrency(total)}
                    </span>
                  </div>
                  <button
                    className="w-full px-4 py-2.5 bg-white text-[#1e1b3d] text-sm font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartData.items.length === 0}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
