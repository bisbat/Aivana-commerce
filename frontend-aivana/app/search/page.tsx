"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  // const searchParams = useSearchParams();
  // const q = searchParams.get("q") || "";

  // const [results, setResults] = useState<any[]>([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!q) return;

  //   setLoading(true);

  //   fetch(`http://localhost:3001/products/search?q=${q}`)
  //     .then((res) => res.json())
  //     .then((data) => setResults(Array.isArray(data) ? data : []))
  //     .finally(() => setLoading(false));
  // }, [q]);

  return (
    // <div className="max-w-7xl mx-auto px-6 py-10">
    //   <h1 className="text-2xl font-semibold text-white mb-6">
    //     ผลการค้นหา: <span className="text-purple-400">"{q}"</span>
    //   </h1>

    //   {loading && <p className="text-slate-400">กำลังค้นหา...</p>}

    //   {!loading && results.length === 0 && (
    //     <p className="text-slate-400">ไม่พบผลลัพธ์</p>
    //   )}

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //     {results.map((item) => (
    //       <div
    //         key={item.id}
    //         className="bg-[#0f1729] border border-slate-700 rounded-xl p-4"
    //       >
    //         <h2 className="text-white font-medium">{item.name}</h2>
    //         <p className="text-slate-400 text-sm mt-1">{item.blurb}</p>
    //         <p className="text-purple-400 mt-3 font-semibold">฿{item.price}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div>
      Hi
    </div>
  );
}
