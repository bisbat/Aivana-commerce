"use client";

import { Download, Star, Flag, Package, Search } from "lucide-react";
import { useState } from "react";

export default function MyCollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - คุณจะเปลี่ยนเป็นข้อมูลจริงจาก API
  const mockCollections = [
    {
      id: 1,
      productName: "Dashboard Template Pro",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      purchaseDate: "15 ม.ค. 2567",
      category: "Dashboard",
      price: 1500,
      hasReviewed: false,
    },
    {
      id: 2,
      productName: "E-commerce UI Kit",
      thumbnail:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop",
      purchaseDate: "10 ม.ค. 2567",
      category: "E-commerce",
      price: 2500,
      hasReviewed: true,
    },
    {
      id: 3,
      productName: "Landing Page Collection",
      thumbnail:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
      purchaseDate: "5 ม.ค. 2567",
      category: "Landing Page",
      price: 1200,
      hasReviewed: false,
    },
    {
      id: 4,
      productName: "Admin Panel Dark Mode",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      purchaseDate: "1 ม.ค. 2567",
      category: "Admin Panel",
      price: 1800,
      hasReviewed: false,
    },
    {
      id: 5,
      productName: "Social Media Management Dashboard UI Kit",
      thumbnail:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
      purchaseDate: "20 ธ.ค. 2566",
      category: "Dashboard",
      price: 3200,
      hasReviewed: false,
    },
    {
      id: 6,
      productName: "Minimal Portfolio Template",
      thumbnail:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=300&fit=crop",
      purchaseDate: "18 ธ.ค. 2566",
      category: "Landing Page",
      price: 900,
      hasReviewed: true,
    },
  ];

  const filteredCollections = mockCollections.filter((item) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = (id: number, name: string) => {
    alert(`กำลังดาวน์โหลด: ${name}`);
  };

  const handleReview = (id: number, name: string) => {
    alert(`เปิดหน้ารีวิว: ${name}`);
  };

  const handleReport = (id: number, name: string) => {
    alert(`เปิดหน้ารีพอร์ต: ${name}`);
  };

  return (
    <div className="">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold">คอลเลคชันของฉัน</h1>
          </div>
          <p className="text-slate-400">สินค้าทั้งหมดที่คุณซื้อไว้</p>
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
                    src={item.thumbnail}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                  {item.hasReviewed && (
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
                    title={item.productName}
                  >
                    {item.productName}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      {item.price.toFixed(2)}฿
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(item.id, item.productName)}
                      aria-label="Download"
                      title="ดาวน์โหลด"
                      className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 bg-[#8a57fb] hover:bg-[#7a47eb] cursor-pointer text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>ดาวน์โหลด</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReview(item.id, item.productName)}
                      aria-label="Review"
                      title="รีวิว"
                      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                        item.hasReviewed
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReport(item.id, item.productName)}
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
    </div>
  );
}
