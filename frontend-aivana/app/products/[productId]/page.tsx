"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/types/product/Product";
import { formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { Loader } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { addToCart } from "@/lib/actions/cart.actions";
import { getCurrentUser } from "@/lib/auth";
import { getProductByIdAction } from "@/lib/actions/product.actions";
import { getAllProductsAction } from "@/lib/actions/product.actions";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const allImages = product
    ? [
        product.heroImageUrl,
        ...(product.detailImages?.map((img) =>
          Array.isArray(img.url) ? img.url[0] : img.url
        ) || []),
      ].filter(Boolean)
    : [];

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      const user = await getCurrentUser();
      if (!user) {
        setToast({
          show: true,
          message: "กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า",
          type: "error",
        });
        setTimeout(
          () => setToast({ show: false, message: "", type: "error" }),
          3000
        );
        return;
      }
      await addToCart(
        {
          userId: user.id,
          productId: parseInt(productId),
        }
      );

      setToast({
        show: true,
        message: "เพิ่มสินค้าเข้าตะกร้าสำเร็จ!",
        type: "success",
      });

      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message === "PRODUCT_ALREADY_IN_CART"
          ? "สินค้านี้มีอยู่ในตะกร้าแล้ว"
          : "ไม่สามารถเพิ่มสินค้าเข้าตะกร้าได้ กรุณาลองใหม่อีกครั้ง";

      setToast({
        show: true,
        message: errorMessage,
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "error" }),
        3000
      );
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdAction(productId);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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

    fetchProduct();
    fetchAllProducts();
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
      /* Loading State */
      // FIXME: เอามาไว้ตรงกลาง
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  const getRelatedProducts = (
    currentProduct: Product,
    allProducts: Product[]
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
  // ฟังก์ชันเปิด lightbox
  const openPreview = (index: number) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  // ฟังก์ชันเปลี่ยนรูป
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };
  const handlePreview = (previewUrl: string) => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
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
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
          <div
            className={`rounded-lg px-6 py-4 shadow-lg ${toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
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
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-3 py-10">
        {/* Header Product Name */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {product.name}
          </h1>
          <div className="bg-linear-to-r from-(--linne-purple) to-[#141332] p-3 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-white text-lg font-light">{product.blurb}</p>
            <div className="flex gap-3 mt-4 items-center md:mt-0">
              <button
                onClick={() => {
                  handlePreview(product.previewUrl ?? "");
                }}
                className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-sm cursor-pointer"
              >
                คลิกเพื่อดูตัวอย่าง
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary-hover) transition-colors font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart
                  ? "กำลังเพิ่ม..."
                  : `เพิ่มลงตะกร้า ${formatPriceWithCurrency(product.price)}`}
              </button>
            </div>
          </div>
        </div>

        {/* Main Product */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 mt-10">
          {/* Left Side - Hero Image */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Hero Image - คลิกเพื่อดูรูปที่ 0 */}
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

              {/* Thumbnails - คลิกเพื่อดูรูปตาม index */}
              {product.detailImages && product.detailImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {product.detailImages.slice(0, 6).map((img, index) => (
                    <div
                      key={img.imageId}
                      className="h-72 rounded-lg overflow-hidden bg-slate-800 border-2 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => openPreview(index + 1)} // +1 เพราะ hero image อยู่ index 0
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

              {/* Left Side - Description */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-10">
                {/* Left Side - Description */}
                <div className="lg:col-span-3">
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
                        <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                          {product.installationGuide}
                        </div>
                      </div>
                    )}

                    {product.compatibility &&
                      product.compatibility.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold text-white mb-4">
                            ความเข้ากันได้กับ
                          </h2>
                          <ul className="list-disc list-inside space-y-2 text-slate-300 marker:text-purple-400">
                            {product.compatibility.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>

                {/* Right Side - Compatibility */}
                <div className="lg:col-span-2">
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

              {/* Lightbox with Navigation */}
              {isPreviewOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  {/* Close Button */}
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

                  {/* Previous Button */}
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

                  {/* Image - ลบ padding ออก */}
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={allImages[currentImageIndex] || ""}
                      alt={`Preview ${currentImageIndex}`}
                      className="w-full h-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </div>

                  {/* Next Button */}
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

          {/* Right Side - Product Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product Details */}
            {/* <div className="bg-(--linne-purple) rounded-lg p-5 flex flex-col items-center space-y-3 shadow-lg">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-lg mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg">
                {product.seller?.firstName} {product.seller?.lastName}
              </h3>

          
              <button
                className="text-sm w-full bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold py-2 rounded-lg transition-colors"
                onClick={() =>
                  (window.location.href = `/seller/${product.seller?.username}`)
                }
              >
                เข้าดูโปรไฟล์
              </button>
            </div> */}

            <div className="bg-(--linne-purple) rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-bold text-white">คุณสมบัติ</h3>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">หมวดหมู่:</span>
                  <span className="text-white font-medium">
                    {product.category.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">ประเภทไฟล์:</span>
                  <span className="text-white font-medium">ZIP file</span>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  {product.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm "
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FIXME: ทำ component ของ comment ด้วย */}
        {/* Comments Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            ความคิดเห็น (2)
          </h2>

          {/* Comment List */}
          <div className="space-y-6">
            {/* Comment Item 1 */}
            <div className="bg-(--linne-purple)/50 rounded-xl p-6 transition-all">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shrink-0 shadow-lg ring-2 ring-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-(--primary) font-bold text-base">
                      TewwyLoveP
                    </h3>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-(--primary) transition-colors cursor-pointer text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="font-medium">Reply</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-pink-500 transition-colors cursor-pointer text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">1</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[15px]">
                    ปั้นและผมชื่อแล้วใช้ได้จริงครับ :D
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Item 2 - Reply */}
            <div className="ml-12 bg-(--linne-purple)/50 rounded-xl p-6  border-(--primary) hover:border-purple-500/80 transition-all relative">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-700 flex items-center justify-center text-white shrink-0 shadow-lg ring-2 ring-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>

                {/* Reply Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-(--primary) font-bold text-base">
                        Apisara C.
                      </h3>
                      <span className="text-xs bg-purple-600/50 text-purple-200 px-3 py-1 rounded-full font-semibold border border-purple-400/30 shadow-sm">
                        เจ้าของร้าน
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-(--primary) transition-colors cursor-pointer text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="font-medium">Reply</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-pink-500 transition-colors cursor-pointer text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">1</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[15px]">
                    <span className="text-purple-400 font-semibold">
                      @TewwyLoveP
                    </span>{" "}
                    ขอบคุณมากครับ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-(--linne-purple) rounded-xl p-6">
          <div className="flex gap-4">
            {/* User Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shrink-0 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            {/* Comment Input */}
            <div className="flex-1">
              <textarea
                placeholder="เขียนความคิดเห็นของคุณ..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-(--primary) focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                rows={4}
              ></textarea>
              <div className="flex justify-end mt-3">
                <button className="px-6 py-2.5 bg-(--primary) text-white rounded-lg hover:bg-(--primary-hover) transition-colors font-medium cursor-pointer shadow-lg shadow-purple-500/20">
                  โพสต์ความคิดเห็น
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">แนะนำสำหรับคุณ</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRelatedProducts(product, allProducts).map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-(--linne-purple) rounded-xl overflow-hidden cursor-pointer group"
                onClick={() =>
                  (window.location.href = `/products/${relatedProduct.id}`)
                }
              >
                <div className="aspect-[4/3] bg-slate-800 overflow-hidden">
                  <img
                    src={
                      relatedProduct.heroImageUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-base mb-1 truncate">
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
