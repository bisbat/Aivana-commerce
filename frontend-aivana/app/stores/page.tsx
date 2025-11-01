"use client";
import Image from "next/image";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { ProductCartSeller } from "@/components/ui/seller/ProductCartSeller";
import { useState } from "react";

export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [randomSeed] = useState(() => Math.random());

  return (
    <div className="flex">
      <Sidebar
        storeName="Bisbat Sae-kow"
        currentPath={pathname}
        onAddProductClick={() => router.push("/products/new")}
      />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-">
        <div className="avatar-section w-full flex justify-end">
          <div className="rounded-full w-16 h-16 overflow-hidden border-2 border-gray-300">
            {/* <Image
              src={`https://picsum.photos/192/192?random=${randomSeed}`}
              alt="Store Avatar"
              width={65}
              height={65}
              className="rounded-full"
              priority
              unoptimized
            /> */}
          </div>
        </div>
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCartSeller key={i} />
          ))}
        </section>
      </main>
    </div>
  );
}
