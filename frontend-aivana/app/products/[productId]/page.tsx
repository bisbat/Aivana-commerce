"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/types/product/Product";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { Loader, EyeOff, AlertTriangle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { addToCart } from "@/lib/actions/cart.actions";
import { getCurrentUser } from "@/lib/auth";
import { getProductByIdAction } from "@/lib/actions/product.actions";
import { getAllProductsAction } from "@/lib/actions/product.actions";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { UserProfile } from "@/lib/types/user/user";
import { getUserCollections } from "@/lib/actions/user-collection.actions";
import { UserCollection } from "@/lib/types/userCollection";
import { use } from "react";

interface Props {
  productId: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const { productId } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [collections, setCollections] = useState<UserCollection[]>([]);

  const prohibitedRolesForPurchase =
    currentUser?.role === "seller" || currentUser?.role === "admin";

  const isUserProduct = collections.some(
    (collection) => collection.product.id === product?.id,
  );
  const isAdmin = currentUser?.role === "admin";
  const isSeller = currentUser?.role === "seller";
  const isOwner = isSeller && product?.seller?.userId === currentUser?.id;

  const isPurchaseDisabled =
    prohibitedRolesForPurchase ||
    isUserProduct ||
    product?.isDeleted ||
    product?.isHidden; // ✅ ซ่อนอยู่ก็ซื้อไม่ได้

  const allImages = product
    ? [
      product.heroImageUrl,
      ...(product.detailImages?.map((img) =>
        Array.isArray(img.url) ? img.url[0] : img.url,
      ) || []),
    ].filter(Boolean)
    : [];

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const user = await getCurrentUser();
      if (!user) {
        showErrorToast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า");
        return;
      }
      setCurrentUser(user);
      await addToCart({ userId: user.id, productId: parseInt(productId) });
      showSuccessToast("เพิ่มสินค้าเข้าตะกร้าสำเร็จ!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message === "PRODUCT_ALREADY_IN_CART"
          ? "สินค้านี้มีอยู่ในตะกร้าแล้ว"
          : "ไม่สามารถเพิ่มสินค้าเข้าตะกร้าได้ กรุณาลองใหม่อีกครั้ง";
      showErrorToast(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdAction(productId);
        if (!data) {
          router.push("/");
          return;
        }
        setProduct(data);
      } catch (err) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const data = await getAllProductsAction();
        setAllProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        if (user) {
          const userCollections = await getUserCollections();
          setCollections(userCollections);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchProduct();
    fetchAllProducts();
    fetchCurrentUser();
  }, [productId]);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPreviewOpen]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  const getRelatedProducts = (
    currentProduct: Product,
    allProducts: Product[],
  ) => {
    if (!currentProduct) return [];
    const scoredProducts = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .map((product) => {
        let score = 0;
        if (product.category === currentProduct.category) score += 3;
        const commonTags =
          product.tags?.filter((tag) => currentProduct.tags?.includes(tag))
            .length || 0;
        score += commonTags;
        if (product.seller?.id === currentProduct.seller?.id) score += 2;
        const priceDiff = Math.abs(product.price - currentProduct.price);
        if (priceDiff < currentProduct.price * 0.3) score += 1;
        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.product);
    return scoredProducts;
  };

  const openPreview = (index: number) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  const goToPrev = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };
  const handlePreview = (previewUrl: string) => {
    if (previewUrl) window.open(previewUrl, "_blank");
  };
  const handleTagClick = (tagName?: string) => {
    if (tagName) router.push(`/products?tag=${encodeURIComponent(tagName)}`);
  };

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-3 py-10">
        <div className="space-y-4" />

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 mt-10">
          {/* Left Side */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <div
                className="aspect-[17/11] rounded-xl overflow-hidden bg-slate-800 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => openPreview(0)}
              >
                {product.heroImageUrl ? (
                  <img
                    src={product.heroImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    No Image
                  </div>
                )}
              </div>

              {product.detailImages && product.detailImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {product.detailImages.slice(0, 6).map((img, index) => (
                    <div
                      key={img.imageId}
                      className="h-72 rounded-lg overflow-hidden bg-slate-800 border-2 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => openPreview(index + 1)}
                    >
                      <img
                        src={Array.isArray(img.url) ? img.url[0] : img.url}
                        alt={`Detail ${img.imageId}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">
                      รายละเอียด
                    </h2>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </div>
                  </div>
                  {product.installationGuide && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">
                        วิธีใช้
                      </h2>
                      <MarkdownRenderer content={product.installationGuide} />
                    </div>
                  )}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">
                        คุณสมบัติ
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-slate-300 marker:text-purple-400">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {isPreviewOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <button
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
                    onClick={() => setIsPreviewOpen(false)}
                  >
                    <svg
                      className="w-8 h-8"
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
                  </button>
                  {allImages.length > 1 && (
                    <button
                      className="absolute left-4 text-white/80 hover:text-white transition-colors z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrev();
                      }}
                    >
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={allImages[currentImageIndex] || ""}
                      alt={`Preview ${currentImageIndex}`}
                      className="w-full h-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </div>
                  {allImages.length > 1 && (
                    <button
                      className="absolute right-4 text-white/80 hover:text-white transition-colors z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                    >
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-purple-900/5 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-purple-500/5">
              <div className="bg-gradient-to-r from-purple-700/60 via-purple-900/50 to-[#141332]/60 rounded-xl p-5 shadow-lg flex flex-col gap-4 overflow-hidden">
                {/* Product Name */}
                <div className="pb-3 border-b border-white/10 flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 pb-2 text-xs">
                    <span className="text-purple-100/50">ขายโดย</span>
                    {product.seller?.username ? (
                      <span
                        className="text-purple-200 font-medium hover:underline transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(`/seller/${product.seller!.username}`)
                        }
                      >
                        @{product.seller.username}
                      </span>
                    ) : (
                      <span className="text-white/80 font-medium">
                        Unknown Seller
                      </span>
                    )}
                  </div>
                </div>

                {/* Hidden Banner */}
                {product.isHidden && !product.isDeleted && (
                  <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <EyeOff
                        size={18}
                        className="text-orange-400 mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-orange-400 font-semibold mb-1 text-sm">
                          {isAdmin
                            ? "พักการขายชั่วคราวโดยระบบ"
                            : isOwner
                              ? "สินค้าของคุณถูกพักการขายชั่วคราว"
                              : "สินค้านี้ถูกพักการขายชั่วคราว"}
                        </h3>
                        <p className="text-orange-300/70 text-xs leading-relaxed">
                          {isAdmin
                            ? "สินค้านี้ถูกพักการขายชั่วคราวโดยระบบ ไม่แสดงในหน้าร้านค้า admin เท่านั้นที่เห็นหน้านี้ได้"
                            : isOwner
                              ? "สินค้าของคุณถูกพักการขายชั่วคราว กรุณาตรวจสอบและแก้ไข"
                              : "สินค้านี้ถูกพักการขายชั่วคราว แต่คุณยังสามารถดูรายละเอียดและดาวน์โหลดไฟล์ที่ซื้อไว้แล้วได้"}
                        </p>
                        {product.hiddenAt && (isAdmin || isOwner) && (
                          <p className="text-orange-300/50 text-xs mt-2">
                            ซ่อนเมื่อ:{" "}
                            {new Date(product.hiddenAt).toLocaleDateString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ Deleted Banner */}
                {product.isDeleted && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        size={18}
                        className="text-red-400 mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-red-400 font-semibold mb-1 text-sm">
                          ยกเลิกการขายแล้ว
                        </h3>
                        <p className="text-red-300/80 text-xs leading-relaxed">
                          ยกเลิกการขายโดยผู้ขายแล้ว
                          คุณยังสามารถดูรายละเอียดและดาวน์โหลดไฟล์ที่ซื้อไว้แล้วได้
                        </p>
                        {product.deletedAt && (
                          <p className="text-red-300/60 text-xs mt-2">
                            ลบเมื่อ:{" "}
                            {new Date(product.deletedAt).toLocaleDateString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <p className="text-white text-base font-light drop-shadow-sm leading-relaxed">
                    {product.blurb}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handlePreview(product.previewUrl ?? "")}
                    className="px-4 py-2 border-2 border-white/50 text-white/90 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                  >
                    คลิกเพื่อดูตัวอย่าง
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || isPurchaseDisabled}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow"
                  >
                    {addingToCart
                      ? "กำลังเพิ่ม..."
                      : product.isDeleted
                        ? "ยกเลิกการขายแล้ว"
                        : product.isHidden
                          ? "พักการขายชั่วคราว"
                          : isUserProduct
                            ? "คุณมีสินค้านี้แล้ว"
                            : prohibitedRolesForPurchase
                              ? "ไม่สามารถซื้อได้"
                              : `เพิ่มลงตะกร้า ${formatPriceWithCurrency(product.price)}`}
                  </button>
                </div>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm hover:bg-purple-600/30 hover:border-purple-400/50 hover:text-white transition-colors cursor-pointer"
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                รองรับการใช้งาน - Compatibility
              </h3>

              {product.compatibility && product.compatibility.length > 0 && (
                <div className="space-y-2">
                  {product.compatibility.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      </div>
                      <span className="text-white/90 font-medium text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ชุดเทคโนโลยีที่ใช้ - Tech stack
              </h3>

              {product.techstack && product.techstack.length > 0 && (
                <div className="space-y-2">
                  {product.techstack.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      </div>
                      <span className="text-white/90 font-medium text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ข้อกำหนด สภาพแวดล้อม - Requirements
              </h3>

              {product.requirement && product.requirement.length > 0 && (
                <div className="space-y-2">
                  {product.requirement.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      </div>
                      <span className="text-white/90 font-medium text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            ความคิดเห็น ({product.reviews.length})
          </h2>
          <div className="space-y-6">
            {product.reviews?.map((review) => (
              <div
                key={review.id}
                className="bg-(--linne-purple)/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shrink-0 shadow-lg ring-2 ring-purple-500/20">
                    {review.user?.avatarUrl ? (
                      <img
                        src={review.user.avatarUrl}
                        alt={review.user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold">
                        {review.user?.username?.charAt(0).toUpperCase() || (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-(--primary) font-bold text-base">
                        @{review.user?.username}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 bg-black/20 px-2 py-0.5 rounded-full">
                        <span>⭐ {review.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[15px]">
                      {review.comment || "ไม่มีความคิดเห็นเพิ่มเติม"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">แนะนำสำหรับคุณ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRelatedProducts(product, allProducts).map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-(--linne-purple) rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => router.push(`/products/${relatedProduct.id}`)}
              >
                <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                  <img
                    src={
                      relatedProduct.heroImageUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-base mb-1 truncate group-hover:text-purple-400 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-slate-300 text-xs mb-4 truncate">
                    {relatedProduct.blurb}
                  </p>
                  <span className="text-white font-semibold text-base">
                    {formatPriceWithCurrency(relatedProduct.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
