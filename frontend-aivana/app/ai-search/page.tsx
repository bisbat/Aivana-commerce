'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { X } from "lucide-react";
import { Product } from "@/lib/types/product/Product";

import { SearchInput } from "@/components/ai-search/SearchInput";
import { EmptyState } from "@/components/ai-search/EmptyState";
import MessageList from "@/components/ai-search/MessageList";
import { getBundleRecommendation } from "@/lib/actions/ai-search.actions";

export default function AiSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (overrideQuery?: string) => {
        const text = (overrideQuery ?? query).trim();
        if (!text || loading) return;

        setQuery("");
        setMessages((prev) => [...prev, { type: "user", text }]);
        setLoading(true);

        try {
            const { success, data } = await getBundleRecommendation(text);

            if (!success || !data) throw new Error();

            setMessages((prev) => [...prev, { type: "bundle", bundle: data }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { type: "error", text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAll = (products: Product[]) => {
        alert(`เพิ่ม ${products.length} รายการลงตะกร้าแล้ว!`);
    };

    const isEmpty = messages.length === 0;

    return (
        <div className="fixed inset-0 z-50 bg-[#0f0d24] flex flex-col font-sans">
            <header className="flex items-center gap-3 px-5 py-4 border-b border-[#1e1b3d] bg-[#0f0d24]/95 backdrop-blur-md shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shrink-0">
                    <Sparkles size={17} className="text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-slate-100 leading-none">AI Search</h1>
                    <p className="text-xs text-slate-500 mt-0.5">แนะนำชุดสินค้าที่เหมาะกับคุณ</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="ml-auto w-8 h-8 rounded-lg bg-[#1e1b3d] hover:bg-[#262449] text-slate-500 hover:text-slate-200 flex items-center justify-center transition-all"
                    aria-label="Close"
                >
                    <X size={15} />
                </button>
            </header>
            <div className="flex-1 overflow-hidden flex flex-col">
                {isEmpty ? (
                    <EmptyState onSuggestionClick={handleSearch} />
                ) : (
                    <MessageList
                        messages={messages}
                        loading={loading}
                        onAddAll={handleAddAll}
                    />
                )}
            </div>

            <SearchInput
                value={query}
                onChange={setQuery}
                onSubmit={() => handleSearch()}
                disabled={loading}
            />

        </div>
    );

}