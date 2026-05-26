"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "@/lib/actions/order.actions";
import { getProductByIdAction } from "@/lib/actions/product.actions";
import { getCurrentUser } from "@/lib/auth";
import { Order } from "@/lib/types/order";
import { PaymentStatus } from "@/lib/constants/paymentStatus";
import { PaymentMethod } from "@/lib/constants/paymentMethod";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import {
  Package,
  Calendar,
  CreditCard,
  Smartphone,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [productDetails, setProductDetails] = useState<Record<string, any>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const user = await getCurrentUser();
        if (!user) {
          router.push("/");
          return;
        }

        const data = await getUserOrders();
        setOrders(data);

        const uniqueProductIds: string[] = [];
        data.forEach((order: Order) => {
          order.items?.forEach((item) => {
            if (!uniqueProductIds.includes(item.productId)) {
              uniqueProductIds.push(item.productId);
            }
          });
        });

        const products: Record<string, any> = {};
        for (const productId of uniqueProductIds) {
          try {
            const product = await getProductByIdAction(productId);
            products[productId] = product;
          } catch (err) {
            console.error(`ไม่สามารถดึงข้อมูลสินค้า ${productId}:`, err);
          }
        }

        setProductDetails(products);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case PaymentStatus.PENDING:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case PaymentStatus.FAILED:
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "ชำระเงินแล้ว";
      case PaymentStatus.PENDING:
        return "รอชำระเงิน";
      case PaymentStatus.FAILED:
        return "ชำระเงินไม่สำเร็จ";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return "บัตรเครดิต/เดบิต";
      case PaymentMethod.PROMPTPAY:
        return "พร้อมเพย์";
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return <CreditCard className="w-4 h-4 text-pink-400" />;
      case PaymentMethod.PROMPTPAY:
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-purple-400"
            size={48}
          />
          <p className="text-slate-400">กำลังโหลดประวัติการซื้อ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-red-400" size={64} />
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold  mb-4">ประวัติการซื้อ</h1>
        <p className="text-slate-400">รายการคำสั่งซื้อทั้งหมดของคุณ</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-linear-to-br from-[#1e1b3d] to-[#1a1733] rounded-xl border border-purple-500/20 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Package className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-300 text-lg mb-2">ยังไม่มีประวัติการซื้อ</p>
          <p className="text-slate-500 text-sm mb-6">
            เริ่มต้นช้อปปิ้งกับเราวันนี้!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-linear-to-r from-purple-500/90 to-pink-500/90 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg shadow-purple-500/20"
          >
            เริ่มช้อปปิ้ง
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div
                key={order.id}
                className="bg-gradient-to-br from-[#1e1b3d] to-[#1a1733] rounded-xl border border-[#262549] overflow-hidden hover:border-purple-500/50 transition-all"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                        คำสั่งซื้อ #{order.id}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          {getPaymentMethodText(order.paymentMethod)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-lg border text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-purple-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#262549]">
                    <span className="text-slate-400 text-sm">
                      จำนวนสินค้า: {order.items?.length || 0} รายการ
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-slate-400 mb-1">
                        ยอดรวมทั้งหมด
                      </p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {formatPriceWithCurrency(Number(order.totalAmount))}
                      </p>
                    </div>
                  </div>
                </div>
                {isExpanded && order.items && (
                  <div className="border-t border-[#262549] bg-[#1a1733]/50 backdrop-blur-sm">
                    <div className="p-6 space-y-4">
                      {order.items.map((item) => {
                        const product = productDetails[item.productId];
                        return (
                          <Link
                            key={item.id}
                            href={`/products/${item.productId}`}
                            className="flex gap-4 p-4 bg-[#1e1b3d]/80 rounded-lg border border-[#262549] hover:border-purple-500/30 transition-all group cursor-pointer"
                          >
                            {product?.isDeleted && (
                              <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"></div>
                            )}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#262549] ring-1 ring-[#363455] group-hover:ring-purple-500/30 transition-all">
                              {product?.heroImageUrl ? (
                                <img
                                  src={product.heroImageUrl}
                                  alt={product.name || "สินค้า"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-slate-600" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start gap-2">
                                <h4 className="text-white group-hover:text-purple-300 transition-colors font-medium line-clamp-2 flex-1">
                                  {product?.name || "กำลังโหลดข้อมูลสินค้า..."}
                                </h4>
                                {product?.isDeleted && (
                                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30 whitespace-nowrap z-30">
                                    ยกเลิกการขายแล้ว
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 mt-1">
                                Product ID: {item.productId}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-white font-semibold">
                                {formatPriceWithCurrency(Number(item.price))}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
