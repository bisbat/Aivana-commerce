"use client";

import { getUserCollections } from "@/lib/actions/user-collection.actions";
import {
  createOrUpdateReportAction,
  getReportByOrderItemAction,
} from "@/lib/actions/report.actions";
import { UserCollection } from "@/lib/types/userCollection";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { Download, Star, Flag, Package, Search, Loader2 } from "lucide-react";
import ReviewModal from "@/components/ReviewModal";
import ReportModal from "@/components/ReportModal";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

import { useEffect, useState } from "react";

export default function MyCollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCollections.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/products/${item.product.id}`)}
              className="group cursor-pointer rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 h-auto w-full overflow-hidden bg-slate-800/60 relative"
            >
              {/* Overlay for deleted products - แทนการใช้ opacity ทั้ง card */}
              {item.product.isDeleted && (
                <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"></div>
              )}

              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
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
                    <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit shadow-xl text-white">
                      <span>⚠️ สินค้าถูกลบ</span>
                    </div>
                  ) : (
                    <>
                      {item.product.hasReviewed ? (
                        <div className="bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium w-fit">
                          <Star size={10} fill="white" />
                          <span>รีวิวแล้ว</span>
                        </div>
                      ) : (
                        <div className="bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium w-fit animate-pulse">
                          <Star size={10} fill="white" />
                          <span>รอรีวิว</span>
                        </div>
                      )}
                      {item.product.hasReported && (
                        <div className="bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium w-fit">
                          <Flag size={10} fill="white" />
                          <span>รีพอร์ตแล้ว</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col gap-3">
                <h3
                  className={`text-base font-semibold line-clamp-2 mb-1 truncate group-hover:text-purple-400 transition-colors ${
                    item.product.isDeleted ? "text-slate-400" : ""
                  }`}
                  title={item.product.name}
                >
                  {item.product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">
                    {formatPriceWithCurrency(item.product.price)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item.product.uploadedFilePath);
                    }}
                    aria-label="Download"
                    title="ดาวน์โหลด"
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 bg-[#8a57fb] hover:bg-[#7a47eb] cursor-pointer text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลด</span>
                  </button>

                  <button
                    type="button"
                    disabled={
                      item.product.hasReviewed || item.product.isDeleted
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!item.product.isDeleted) {
                        handleReview(item.product.id, item.product.name);
                      }
                    }}
                    aria-label="Review"
                    title={
                      item.product.isDeleted
                        ? "สินค้าถูกลบแล้ว"
                        : item.product.hasReviewed
                          ? "รีวิวแล้ว"
                          : "คลิกเพื่อรีวิว"
                    }
                    className={`
                        w-9 h-9 flex items-center justify-center rounded-lg
                        transition-all duration-150 
                        ${
                          item.product.isDeleted || item.product.hasReviewed
                            ? "bg-slate-700 cursor-not-allowed opacity-60"
                            : "bg-amber-500 hover:bg-amber-600 cursor-pointer animate-pulse"
                        }
                      `}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={item.product.isDeleted}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!item.product.isDeleted) {
                        handleReport(
                          item.product.id,
                          item.product.name,
                          item.orderItemId,
                        );
                      }
                    }}
                    aria-label="Report"
                    title={
                      item.product.isDeleted
                        ? "สินค้าถูกลบแล้ว"
                        : item.product.hasReported
                          ? "แก้ไขรีพอร์ต"
                          : "รีพอร์ต"
                    }
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 ${
                      item.product.isDeleted
                        ? "bg-slate-700 cursor-not-allowed opacity-60"
                        : item.product.hasReported
                          ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                          : "bg-slate-700 hover:bg-red-600 cursor-pointer"
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
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
