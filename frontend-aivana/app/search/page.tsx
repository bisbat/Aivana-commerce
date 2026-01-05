"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/home/ProductGrid";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    setLoading(true);

    fetch(`http://localhost:3001/products/search?q=${q}`)
      .then((res) => res.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-white mb-6">
        ผลการค้นหา: <span className="text-purple-400">"{q}"</span>
      </h1>

      {loading && <p className="text-slate-400">กำลังค้นหา...</p>}

      <ProductGrid products={results} showHeader={false} />
    </div>
  );
}
