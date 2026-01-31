"use client";

import { getUserCollections } from "@/lib/actions/user-collection.actions";
import { createOrUpdateReportAction } from "@/lib/actions/report.actions";
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
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        console.log("Current User:", user);
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

  const handleDownload = (id: string, name: string, filePath: string) => {
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

  const handleReport = (
    productId: string,
    name: string,
    orderItemId: number,
  ) => {
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
      showSuccessToast("ส่งรายงานเรียบร้อยแล้ว");
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
    <div className="">
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
                className="group cursor-pointer rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 h-auto w-full overflow-hidden bg-slate-800/60"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                  <img
                    src={
                      item.product.heroImageUrl ||
                      "https://via.placeholder.com/200x150"
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {item.product.hasReviewed && (
                    <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                      <Star size={10} fill="white" />
                      <span>รีวิวแล้ว</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col gap-3">
                  <h3
                    className="text-base font-semibold line-clamp-2 mb-1 truncate group-hover:text-purple-400 transition-colors"
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
                        handleDownload(
                          item.product.id,
                          item.product.name,
                          item.product.uploadedFilePath,
                        );
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
                      disabled={item.product.hasReviewed}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview(item.product.id, item.product.name);
                      }}
                      aria-label="Review"
                      title="รีวิว"
                      className={`
                        w-9 h-9 flex items-center justify-center rounded-lg
                        transition-all duration-150
                        ${
                          item.product.hasReviewed
                            ? "bg-slate-700 cursor-not-allowed opacity-60"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }
                      `}
                    >
                      <Star className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReport(
                          item.product.id,
                          item.product.name,
                          item.orderItemId,
                        );
                      }}
                      aria-label="Report"
                      title="รีพอร์ต"
                      className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 bg-slate-700 hover:bg-red-600 cursor-pointer"
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
      </div>

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
          currentUser={currentUser}
        />
      )}

      {/* Report Modal */}
      {currentUser && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct?.id || ""}
          productName={selectedProduct?.name || ""}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}
