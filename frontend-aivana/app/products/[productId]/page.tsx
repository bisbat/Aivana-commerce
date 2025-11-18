"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/types/product/Product";
import { Navbar } from "@/components/layout/Navbar";
import { formatPrice, formatPriceWithCurrency } from "@/lib/utils/formatPrice";
import { Loader } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

interface DetailImage {
  image_id: string;
  path_image: string;
  url: string;
}

interface ProductWithImages extends Omit<Product, "detail_images"> {
  detail_images: DetailImage[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/products/${productId}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");

        const data: ProductWithImages = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      /* Loading State */
      // FIXME: เอามาไว้ตรงกลาง
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

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
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Product Name */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {product.name}
          </h1>
          <div className="bg-linear-to-r from-(--linne-purple) to-[#141332] p-3 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-white text-lg font-light">{product.blurb}</p>
            <div className="flex gap-3 mt-4 items-center md:mt-0">
              <button className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-sm cursor-pointer">
                คลิกเพื่อดูตัวอย่าง
              </button>
              <button className="px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary-hover) transition-colors font-medium text-sm cursor-pointer">
                เพิ่มลงตะกร้า {formatPriceWithCurrency(product.price)}
              </button>
            </div>
          </div>
        </div>

        {/* Main Product */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 mt-10">
          {/* Left Side - Hero Image */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[17/11] rounded-xl overflow-hidden bg-slate-800">
              {product.hero_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.hero_image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.detail_images && product.detail_images.length > 0 && (
              <div className="grid grid-cols-6 gap-2">
                {product.detail_images.slice(0, 6).map((img) => (
                  <div
                    key={img.image_id}
                    className="aspect-square rounded-lg overflow-hidden bg-slate-800 border-2 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Detail ${img.image_id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main Product Content */}
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

                  {product.installation_guide && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">
                        วิธีใช้
                      </h2>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {product.installation_guide}
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
          </div>

          {/* Right Side - Product Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Seller Info */}
            <div className="bg-(--linne-purple) rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {product.owner.first_name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-white">
                    {product.owner.first_name} {product.owner.last_name}
                  </div>
                  <div className="text-sm text-slate-400">
                    Professional UX/UI Designer
                  </div>
                </div>
              </div>
              <button className="w-full px-5 py-2.5 bg-(--primary) text-white rounded-lg hover:bg-(--primary-hover) transition-colors font-medium text-sm cursor-pointer">
                เข้าถึงโปรไฟล์
              </button>
            </div>

            {/* Product Details */}
            <div className="bg-(--linne-purple) rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-bold text-white">คุณสมบัติ</h3>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">หมวดหมู่:</span>
                  <span className="text-white font-medium">
                    {product.category.name}
                  </span>
                </div>

                {/* <div className="flex justify-between text-sm">
                  <span className="text-slate-400">รูปแบบไฟล์:</span>
                  <span className="text-white font-medium">
                   
                  </span>
                </div> */}

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
            {/* Product Card 1 */}
            <div className="bg-(--linne-purple) rounded-xl overflow-hidden  cursor-pointer group">
              <div className="aspect-[4/3] bg-slate-800 overflow-hidden">
                <img
                  src="https://picsum.photos/400/300?random=1"
                  alt="Recommended Product 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-(--linne-purple) rounded-xl overflow-hidden  cursor-pointer group">
              <div className="aspect-[4/3] bg-slate-800 overflow-hidden">
                <img
                  src="https://picsum.photos/400/300?random=1"
                  alt="Recommended Product 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-(--linne-purple) rounded-xl overflow-hidden  cursor-pointer group">
              <div className="aspect-[4/3] bg-slate-800 overflow-hidden">
                <img
                  src="https://picsum.photos/400/300?random=1"
                  alt="Recommended Product 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-(--linne-purple) rounded-xl overflow-hidden  cursor-pointer group">
              <div className="aspect-[4/3] bg-slate-800 overflow-hidden">
                <img
                  src="https://picsum.photos/400/300?random=1"
                  alt="Recommended Product 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
