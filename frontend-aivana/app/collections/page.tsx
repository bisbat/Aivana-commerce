"use client";

import { getUserCollections } from "@/lib/actions/user-collection.actions";
import { UserCollection } from "@/lib/types/userCollection";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { Download, Star, Flag, Package, Search, Loader2 } from "lucide-react";
import ReviewModal from "@/components/ReviewModal";
import { getCurrentUser } from "@/lib/auth";

import { useEffect, useState } from "react";

export default function MyCollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user and collections
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
    // TODO: ส่งข้อมูล review ไปยัง API
    console.log("Review submitted:", {
      productId: selectedProduct?.id,
      rating,
      message,
    });

    // คุณสามารถเรียก API ที่นี่
    // await submitReview(selectedProduct?.id, rating, message);

    // อัพเดทสถานะ hasReviewed ใน collections
    setCollections((prev) =>
      prev.map((item) =>
        item.product.id === selectedProduct?.id
          ? { ...item, product: { ...item.product, hasReviewed: true } }
          : item,
      ),
    );
  };

  const handleReport = (productId: string, name: string) => {
    // Navigate ไปหน้ารีพอร์ต
    window.location.href = `/products/${productId}/report`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Loading State
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
                className="rounded-lg p-0 shadow hover:shadow-xl transition-all duration-300 h-auto w-full overflow-hidden bg-slate-800/60"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                  <img
                    src={
                      item.product.heroImageUrl ||
                      "https://via.placeholder.com/200x150"
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />

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
                    className="text-base font-semibold line-clamp-2 mb-1 truncate"
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
                      onClick={() =>
                        handleDownload(
                          item.product.id,
                          item.product.name,
                          item.product.uploadedFilePath,
                        )
                      }
                      aria-label="Download"
                      title="ดาวน์โหลด"
                      className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 bg-[#8a57fb] hover:bg-[#7a47eb] cursor-pointer text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>ดาวน์โหลด</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReview(item.product.id, item.product.name)
                      }
                      aria-label="Review"
                      title="รีวิว"
                      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                        item.product.hasReviewed
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReport(item.product.id, item.product.name)
                      }
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
    </div>
  );
}
