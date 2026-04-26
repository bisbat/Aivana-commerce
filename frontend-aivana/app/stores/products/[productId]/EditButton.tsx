"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function EditButton({ productId }: { productId: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/stores/products/${productId}/edit`)}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium text-sm"
    >
      <Pencil size={16} />
      แก้ไขสินค้า
    </button>
  );
}
