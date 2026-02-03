"use client";

import { Product } from "@/lib/types/product/product";
import { SellerProfile } from "@/lib/types/user/sellerProfile";
import BackgroundAivana from "@/components/common/BackgroundAivana";
import EditButton from "./EditButton";
import { ProductGrid } from "@/components/home/ProductGrid";
import { useRouter } from "next/navigation";

type Props = {
  seller: SellerProfile;
  products: Product[];
  productsTotal: number;
};

export default function SellerProfilePage({
  seller,
  products,
  productsTotal,
}: Props) {
  const router = useRouter();
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <BackgroundAivana />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1 border rounded-md text-sm text-gray-300 hover:bg-neutral-800 transition"
          >
            ← Back
          </button>

          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
            {seller.user.avatarUrl ? (
              <img
                src={seller.user.avatarUrl}
                alt="Seller Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {seller.user.username
                  ? seller.user.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </span>
            )}
          </div>

          {/* Seller Info */}
          <div>
            <h1 className="text-2xl font-semibold">{seller.storeName}</h1>
            <p className="text-gray-400 text-sm">
              {seller.user.firstName} {seller.user.lastName} • @
              {seller.user.username}
            </p>
          </div>
        </div>

        {/* Right Section Buttons */}
        <div className="flex items-center gap-3">
          {/* Contact Button */}
          <button className="px-4 py-2 text-sm border rounded-md hover:bg-neutral-800 transition">
            Contact
          </button>

          {/* Edit Button */}
          <EditButton username={seller.user.username} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/40">
          <p className="text-lg font-semibold">{productsTotal}</p>
          <p className="text-gray-400 text-sm">Products</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/40">
          <p className="text-lg font-semibold">{seller.totalSales}</p>
          <p className="text-gray-400 text-sm">Sales</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/40">
          <p className="text-lg font-semibold">{seller.averageRating}</p>
          <p className="text-gray-400 text-sm">Rating</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/40">
          <p className="text-lg font-semibold">{seller.totalReviews}</p>
          <p className="text-gray-400 text-sm">Reviews</p>
        </div>
      </div>

      {/* About */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="text-gray-300">{seller.bio}</p>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex gap-2 flex-wrap">
          {seller.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-neutral-900/60 text-gray-200 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Socials */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Socials</h2>
        <div className="flex gap-4 text-blue-400 underline text-sm">
          {Object.entries(seller.socials).map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer">
              {key}
            </a>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
