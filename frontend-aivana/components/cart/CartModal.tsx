"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, removeFromCart } from "@/lib/actions/cart.actions";
import { getAuthData } from "@/lib/actions/auth.actions";
import { GetCartResponse } from "@/lib/types/cart/GetCart";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter();
  const [cartData, setCartData] = useState<GetCartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const authData = getAuthData();
      if (!authData.user) {
        setCartData(null);
        return;
      }
      const data = await getCart(authData.user.id);
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
      const authData = getAuthData();
      if (!authData.user) return;

      await removeFromCart(authData.user.id, productId);
      // Refresh cart after removing
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

const total =
  cartData?.items.reduce((sum, item) => sum + Number(item.product.price), 0) ||
  0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - below navbar */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        style={{ top: "64px" }}
        onClick={onClose}
      />

      {/* Modal Container with max-width constraint */}
      <div
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        style={{ top: "15px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-start justify-end relative">
          <div
            className="bg-[#fafafa] rounded-2xl w-full max-w-md h-auto max-h-[calc(100vh-2rem)] mt-16 overflow-hidden shadow-2xl pointer-events-auto flex flex-col fixed"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Shopping Cart
                </h2>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Cart Items */}
                  {cartData?.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        router.push(`/products/${item.productId}`);
                        onClose();
                      }}
                    >
                      {/* Product Image */}
                      <div className="w-20 h-16 bg-gray-200 rounded-md overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                        <h3 className="text-sm font-semibold text-gray-800 mb-0.5 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          by {item.product.seller?.firstName || "Unknown"}{" "}
                          {item.product.seller?.lastName || ""}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-base font-bold text-gray-800 shrink-0">
                        {formatPriceWithCurrency(item.product.price)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.productId);
                        }}
                        disabled={removingItemId === item.productId}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Remove item"
                      >
                        {removingItemId === item.productId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-600"
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
                  ))}

                  {/* Empty Cart Message */}
                  {!loading &&
                    (!cartData?.items || cartData.items.length === 0) && (
                      <div className="text-center py-12">
                        <p className="text-base text-gray-400">
                          Your cart is empty
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Footer - Total and Checkout */}
            {!loading && cartData && (
              <div className="p-4 pt-3 border-t border-gray-200">
                <div className="bg-white rounded-lg p-3 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-bold text-gray-800">
                      {formatPriceWithCurrency(total)}
                    </span>
                  </div>
                  <button
                    className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
