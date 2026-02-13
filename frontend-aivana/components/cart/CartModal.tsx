"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, removeFromCart } from "@/lib/actions/cart.actions";
import { GetCartResponse } from "@/lib/types/cart/GetCart";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { getCurrentUser } from "@/lib/auth";
import { RefObject } from "react";
import { createPayment } from "@/lib/actions/payment.actions";
import { createOrder } from "@/lib/actions/order.actions";
import { PaymentMethod } from "@/lib/constants/paymentMethod";
import { number } from "framer-motion";
import { createCreditCardToken, createPromptpaySource, initOmise } from "@/lib/omise";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'promptpay' | 'credit-card'>('promptpay');
  const omisePublicKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY

  useEffect(() => {
    (window as any).Omise.setPublicKey(
      process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY
    );
    // initOmise();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        setCartData(null);
        return;
      }

      const data = await getCart(user.id);
      console.log("Fetched cart data:", data);
      setCartData(data);

    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethod = (method: "promptpay" | "credit-card") => {
    setSelectedPaymentMethod(method);
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

  const displayTotal = (() => {
    if (!cartData?.items?.length) return "0.00";

    const sum = cartData.items.reduce((acc, item) => {
      const price = Number(item.product.price) || 0;
      return acc + price;
    }, 0);

    return Number(sum).toFixed(2);
  })();

  const numericTotal = (() => {
    if (!cartData?.items?.length) return 0;

    return cartData.items.reduce((acc, item) => {
      const price = Number(item.product.price) || 0;
      return acc + price;
    }, 0);
  })();


  if (!isOpen) return null;

  // const createPromptpaySource = (amount: number): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     (window as any).Omise.createSource(
  //       'promptpay',
  //       {
  //         amount: amount * 100,
  //         currency: 'THB',
  //         type: 'promptpay',
  //       },
  //       (statusCode: number, response: any) => {
  //         if (statusCode !== 200) {
  //           reject(response);
  //         } else {
  //           resolve(response);
  //         }
  //       }
  //     );
  //   });
  // };

  // const createCreditCardToken = (amount: number): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     (window as any).Omise.createToken('card', {
  //       name: 'Aivana Customer',
  //       number: '4242424242424242',
  //       expiration_month: '12',
  //       expiration_year: '2027',
  //       security_code: '123',
  //     }
  //       , (statusCode: number, response: any) => {
  //         if (statusCode !== 200) {
  //           reject(response);
  //         } else {
  //           resolve(response);
  //         }
  //       }
  //     );
  //   });
  // }



  const createSource = async (amount: number, orderId: number, paymentMethod: PaymentMethod) => {
    if (paymentMethod === PaymentMethod.CREDIT_CARD) {
      // const token = await createCreditCardToken();
      // console.log('token:', token);
      // console.log('id:', token.id);
      router.push(`/payment/${orderId}/card`);

    }
    if (paymentMethod === PaymentMethod.PROMPTPAY) {
      try {
        const source = await createPromptpaySource(amount);
        console.log('source:', source);

        await createPayment(source.id, orderId);

        router.push(`/payment/${orderId}`);
      } catch (err) {
        console.error('Create source failed', err);
      }
    }
  };


  const handleCheckout = async () => {
    if (selectedPaymentMethod == 'promptpay') {
      const order = await createOrder(PaymentMethod.PROMPTPAY);
      createSource(numericTotal, order.id, PaymentMethod.PROMPTPAY);
    } else {
      const order = await createOrder(PaymentMethod.CREDIT_CARD);
      createSource(numericTotal, order.id, PaymentMethod.CREDIT_CARD);
    }
  };


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
            className="bg-[#1e1b3d] rounded-xl w-4/12 h-auto max-h-[calc(100vh-2rem)] mt-16 overflow-hidden shadow-xl pointer-events-auto flex flex-col fixed border border-[#262549]"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-[#262549] flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-white font-medium text-2xl">รถเข็น</p>
                {/* <p className="text-slate-400 text-md mt-0.5">
                  {cartData?.items.length || 0} สินค้า
                </p> */}
              </div>
              {/* Footer - Total and Checkout */}
              {!loading && cartData && cartData.items.length > 0 && (
                <div className="py-2 border-t border-[#262549]">
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-between flex-col">
                      <span className="text-md text-slate-400">
                        ราคารวม
                      </span>
                      <span className="text-xl font-semibold text-white">
                        {formatPriceWithCurrency(displayTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
                      className="block px-4 py-3 text-md text-white hover:bg-[#262549] transition-colors cursor-pointer"
                      onClick={() => {
                        router.push(`/products/${item.product.id}`);
                        onClose();
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="w-28 h-26 bg-[#1a1733] rounded overflow-hidden shrink-0">
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
                          <p className="text-md text-white font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-slate-400 text-xs truncate mt-1">
                            @{item.product.seller?.username || "Unknown"}
                          </p>
                          <p className="text-white text-md font-semibold mt-1">
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
                        <p className="text-md text-slate-400">
                          ไม่มีสินค้าในรถเข็น
                        </p>
                      </div>
                    )}
                </>
              )}
            </div>
            {/* Payment method */}
            {!loading && cartData && cartData.items.length > 0 && (
              <div>
                {/* Payment Method Section */}
                <div className="border-t border-[#262549] bg-[#1a1733]">
                  {/* Payment Options */}
                  <div className="p-4 space-y-3">
                    <p className="text-white font-medium text-md mb-3">
                      วิธีการชำระเงิน
                    </p>
                    <div className="flex gap-3">
                      {/* Credit Card Option */}
                      <button
                        onClick={() => handlePaymentMethod("credit-card")}
                        className={`w-full p-3 cursor-pointer rounded-xl transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-purple-500 group
    ${selectedPaymentMethod === "credit-card"
                            ? "bg-[#2d2a52] border-2 border-purple-500" // เมื่อถูกเลือก - เน้นด้วย border สีม่วง
                            : "bg-[#262549] hover:bg-[#2d2a52] border-2 border-transparent hover:border-blue-500/30"
                          }
  `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
      ${selectedPaymentMethod === "credit-card"
                                ? "bg-purple-500/20" // เมื่อถูกเลือก
                                : "bg-[#1e1b3d] group-hover:bg-[#262549]"
                              }
    `}
                          >
                            <svg
                              className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          </div>
                          <span className="text-white font-medium text-md">
                            Credit card
                          </span>

                          {selectedPaymentMethod === "credit-card" && (
                            <svg
                              className="w-5 h-5 text-purple-500 ml-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>

                      {/* PromptPay Option */}
                      <button
                        onClick={() => handlePaymentMethod("promptpay")}
                        className={`w-full p-3 cursor-pointer rounded-xl transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-purple-500 group
    ${selectedPaymentMethod === "promptpay"
                            ? "bg-[#2d2a52] border-2 border-purple-500" // เมื่อถูกเลือก - เน้นด้วย border สีม่วง
                            : "bg-[#262549] hover:bg-[#2d2a52] border-2 border-transparent hover:border-blue-500/30"
                          }
  `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
      ${selectedPaymentMethod === "promptpay"
                                ? "bg-purple-500/20" // เมื่อถูกเลือก
                                : "bg-[#1e1b3d] group-hover:bg-[#262549]"
                              }
    `}
                          >
                            <img
                              src="/icon/promptpay.svg"
                              alt="promptpay-icon"
                              className="w-6"
                            />
                          </div>
                          <span className="text-white font-medium text-md">
                            PromptPay
                          </span>

                          {selectedPaymentMethod === "promptpay" && (
                            <svg
                              className="w-5 h-5 text-purple-500 ml-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-slate-400 text-xs">
                        Payment secured by Omise
                      </p>
                    </div>
                  </div>

                  {!loading && cartData && cartData.items.length > 0 && (
                    <div>
                      <div className="p-4 pt-0">
                        <button
                          onClick={handleCheckout}
                          className="w-full py-3.5 text-md bg-[#8a57fb] hover:bg-[#7a47eb] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            !cartData?.items || cartData.items.length === 0
                          }
                        >
                          ชำระเงิน
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
