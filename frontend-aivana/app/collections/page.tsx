"use client";

import { getUserCollections } from "@/lib/actions/user-collection.actions";
import {
  createOrUpdateReportAction,
  getReportByOrderItemAction,
} from "@/lib/actions/report.actions";
import { UserCollection } from "@/lib/types/userCollection";
import type { Report } from "@/lib/types/report";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import {
  Download,
  Star,
  Flag,
  Package,
  Search,
  Loader2,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ReviewModal from "@/components/ReviewModal";
import ReportModal from "@/components/ReportModal";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

import { useEffect, useState, type ElementType } from "react";

export default function MyCollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reportsByOrderItemId, setReportsByOrderItemId] = useState<
    Record<number, Report | null>
  >({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    orderItemId?: number;
  } | null>(null);
  const [existingReport, setExistingReport] = useState<{
    reason: string;
    message: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        // ตรวจสอบ authentication
        if (!user) {
          router.push("/");
          return;
        }

        setCurrentUser(user);

        const data = await getUserCollections();
        setCollections(data);

        // Load report status for items that were reported (simple + fast)
        const reportedOrderItemIds = Array.from(
          new Set(
            data
              .filter((item) => item.product.hasReported && item.orderItemId)
              .map((item) => item.orderItemId)
              .filter((id): id is number => typeof id === "number"),
          ),
        );

        if (reportedOrderItemIds.length > 0) {
          const entries = await Promise.all(
            reportedOrderItemIds.map(async (orderItemId) => {
              try {
                const report = await getReportByOrderItemAction(orderItemId);
                return [orderItemId, report] as const;
              } catch (e) {
                return [orderItemId, null] as const;
              }
            }),
          );

          setReportsByOrderItemId(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCollections = collections.filter((item) =>
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = (filePath: string) => {
    window.open(filePath, "_blank");
  };

  const handleReview = (productId: string, name: string) => {
    setSelectedProduct({ id: productId, name });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, message: string) => {
    console.log("Review submitted:", {
      productId: selectedProduct?.id,
      rating,
      message,
    });
    setCollections((prev) =>
      prev.map((item) =>
        item.product.id === selectedProduct?.id
          ? { ...item, product: { ...item.product, hasReviewed: true } }
          : item,
      ),
    );
  };

  const handleReport = async (
    productId: string,
    name: string,
    orderItemId: number,
  ) => {
    try {
      const report = await getReportByOrderItemAction(orderItemId);
      setReportsByOrderItemId((prev) => ({ ...prev, [orderItemId]: report }));
      if (report) {
        setExistingReport({
          reason: report.reason,
          message: report.message || "",
        });
      } else {
        setExistingReport(null);
      }
    } catch (error) {
      console.error("Error fetching existing report:", error);
      setExistingReport(null);
    }
    setSelectedProduct({ id: productId, name, orderItemId });
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (reason: string, message: string) => {
    if (!selectedProduct?.orderItemId) {
      showErrorToast("ไม่พบข้อมูลการสั่งซื้อ");
      return;
    }

    try {
      await createOrUpdateReportAction({
        orderItemId: selectedProduct.orderItemId,
        reason,
        message: message.trim() || null,
      });

      // Refresh status after submit/update (so user sees it immediately)
      try {
        const report = await getReportByOrderItemAction(
          selectedProduct.orderItemId,
        );
        setReportsByOrderItemId((prev) => ({
          ...prev,
          [selectedProduct.orderItemId!]: report,
        }));
      } catch (e) {
        // ignore
      }

      // Update collections state to reflect hasReported
      setCollections((prev) =>
        prev.map((item) =>
          item.orderItemId === selectedProduct.orderItemId
            ? { ...item, product: { ...item.product, hasReported: true } }
            : item,
        ),
      );

      if (existingReport) {
        showSuccessToast("อัปเดตรายงานเรียบร้อยแล้ว");
      } else {
        showSuccessToast("ส่งรายงานเรียบร้อยแล้ว");
      }
    } catch (error: any) {
      console.error("Error submitting report:", error);
      showErrorToast(error.message || "เกิดข้อผิดพลาดในการส่งรายงาน");
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
          <p className="text-slate-400">กำลังโหลดคอลเลคชัน...</p>
        </div>
      </div>
    );
  }

  // Error State
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-purple-400" size={32} />
          <h1 className="text-3xl font-bold">คอลเลคชัน</h1>
        </div>
        <p className="text-slate-400">
          สินค้าทั้งหมดที่คุณซื้อไว้ ({collections.length} รายการ)
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="ค้นหาสินค้าในคอลเลคชันของคุณ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* Collection Grid */}
      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {filteredCollections.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/products/${item.product.id}`)}
              className="group cursor-pointer rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 h-auto w-full overflow-hidden bg-slate-800/60 relative flex flex-col" // เพิ่ม flex flex-col ที่ container หลัก
            >
              {/* Overlay for deleted products */}
              {item.product.isDeleted && (
                <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"></div>
              )}

              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden shrink-0">
                {" "}
                {/* เพิ่ม shrink-0 ป้องกันรูปโดนบีบ */}
                <img
                  src={
                    item.product.heroImageUrl ||
                    "https://via.placeholder.com/200x150"
                  }
                  alt={item.product.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    item.product.isDeleted ? "grayscale opacity-60" : ""
                  }`}
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                  {item.product.isDeleted ? (
                    <div className="bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold w-fit shadow-xl text-white">
                      <span>⚠️ ยกเลิกการขาย</span>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`text-white backdrop-blur-sm px-2 py-1 rounded-full 
                        flex items-center gap-1 text-[10px] font-bold w-fit shadow-md transition-all duration-150
                        ${item.product.hasReviewed ? "bg-slate-700" : "bg-amber-500/90 animate-pulse"}`}
                      >
                        <Star
                          size={10}
                          fill={
                            item.product.hasReviewed ? "currentColor" : "none"
                          }
                        />
                        <span>
                          {item.product.hasReviewed ? "รีวิวแล้ว" : "รอรีวิว"}
                        </span>
                      </div>

                      {item.product.hasReported &&
                        item.orderItemId &&
                        (() => {
                          const reportStatus =
                            reportsByOrderItemId[item.orderItemId]?.status;

                          if (reportStatus === "resolved") {
                            return (
                              <div className="bg-emerald-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold w-fit shadow-xl text-white">
                                <CheckCircle size={10} />
                                <span>รีพอร์ตได้แก้ไขแล้ว</span>
                              </div>
                            );
                          } else if (reportStatus === "rejected") {
                            return (
                              <div className="bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold w-fit shadow-md text-white">
                                <XCircle size={10} />
                                <span>รีพอร์ตไม่ผ่านการตรวจสอบ</span>
                              </div>
                            );
                          } else if (reportStatus === "product_deleted") {
                            return (
                              <div className="bg-purple-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold w-fit shadow-md text-white">
                                <CheckCircle size={10} />
                                <span>ยกเลิกการขายสินค้า</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="bg-orange-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold w-fit text-white">
                                <Flag size={10} fill="white" />
                                <span>รีพอร์ตแล้ว</span>
                              </div>
                            );
                          }
                        })()}
                    </>
                  )}
                </div>
              </div>

              {/* Content Section (จัด Flex ให้เต็มพื้นที่) */}
              <div className="flex flex-col flex-1">
                {" "}
                {/* flex-1 เพื่อให้ส่วนนี้ยืดเต็มที่เหลือ */}
                <div className="p-3 flex flex-col gap-3 flex-1">
                  <h3
                    className={`text-base font-semibold line-clamp-2 mb-1 truncate group-hover:text-purple-400 transition-colors ${
                      item.product.isDeleted ? "text-slate-400" : ""
                    }`}
                    title={item.product.name}
                  >
                    {item.product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    {" "}
                    {/* mt-auto ดันราคาและปุ่มไปล่างสุดของ content block */}
                    <span className="text-xl font-bold">
                      {formatPriceWithCurrency(item.product.price)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item.product.uploadedFilePath);
                      }}
                      className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 bg-[#8a57fb] hover:bg-[#7a47eb] cursor-pointer text-sm font-medium z-20"
                    >
                      <Download className="w-4 h-4" />
                      <span>ดาวน์โหลด</span>
                    </button>

                    {/* Review Button */}
                    <button
                      type="button"
                      disabled={
                        item.product.hasReviewed || item.product.isDeleted
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!item.product.isDeleted)
                          handleReview(item.product.id, item.product.name);
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 ${
                        item.product.isDeleted || item.product.hasReviewed
                          ? "bg-slate-700 cursor-not-allowed opacity-60 text-slate-400"
                          : "bg-amber-500/90 text-white shadow-lg hover:bg-amber-500"
                      }`}
                    >
                      <Star
                        className="w-4 h-4"
                        fill={
                          item.product.hasReviewed ? "currentColor" : "none"
                        }
                      />
                    </button>

                    {/* Report Button Logic */}
                    {(() => {
                      const report = item.orderItemId
                        ? reportsByOrderItemId[item.orderItemId]
                        : null;
                      const isResolved = report?.status === "resolved";
                      const isRejected = report?.status === "rejected";

                      if (isResolved) {
                        // ✅ Case: แก้ไขแล้ว (แสดงปุ่มเขียว)
                        return (
                          <button
                            type="button"
                            disabled={true}
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg cursor-not-allowed opacity-75"
                            title="รายงานได้รับการแก้ไขแล้ว"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        );
                      } else if (isRejected) {
                        // ❌ Case: ถูกปฏิเสธ (แสดงปุ่มแดง)
                        return (
                          <button
                            type="button"
                            disabled={true}
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white shadow-lg cursor-not-allowed opacity-75"
                            title="รายงานไม่ผ่านการตรวจสอบ"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        );
                      }

                      // 🚩 Case: ยังไม่แก้ไข หรือยังไม่มี Report
                      return (
                        <button
                          type="button"
                          disabled={item.product.isDeleted}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!item.product.isDeleted) {
                              handleReport(
                                item.product.id,
                                item.product.name,
                                item.orderItemId!,
                              );
                            }
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 ${
                            item.product.isDeleted
                              ? "bg-slate-700 cursor-not-allowed opacity-60 text-slate-400"
                              : item.product.hasReported
                                ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                                : "bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-600"
                          }`}
                        >
                          <Flag
                            className="w-4 h-4"
                            fill={
                              item.product.hasReported ? "currentColor" : "none"
                            }
                          />
                        </button>
                      );
                    })()}
                  </div>
                </div>
                {(() => {
                  const report = item.orderItemId
                    ? reportsByOrderItemId[item.orderItemId]
                    : null;
                  if (
                    report?.status === "resolved" ||
                    report?.status === "rejected"
                  ) {
                    return (
                      <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-[650ms] ease-in-out">
                        <div className="px-3 py-2 bg-purple-500/10 border-t border-purple-500/20">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-[10px] text-slate-400">
                              ยังพบปัญหา?
                            </span>
                            <a
                              href="mailto:labuboon@gmail.com"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-semibold text-purple-400 hover:text-purple-300  px-2 py-1 rounded-md underline decoration-dotted underline-offset-2 transition-all duration-200 cursor-pointer relative z-30"
                            >
                              ติดต่อทีมสนับสนุน
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="mx-auto text-slate-600 mb-4" size={64} />
          <p className="text-slate-400 text-lg">ไม่พบสินค้าที่ค้นหา</p>
        </div>
      )}

      {/* Review Modal */}
      {currentUser && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct?.id || ""}
          productName={selectedProduct?.name || ""}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Report Modal */}
      {currentUser && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedProduct(null);
            setExistingReport(null);
          }}
          productId={selectedProduct?.id || ""}
          productName={selectedProduct?.name || ""}
          existingReason={existingReport?.reason}
          existingMessage={existingReport?.message}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}
