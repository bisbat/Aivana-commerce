"use client";

import { useEffect, useRef } from "react";
import { MessageType } from "@/lib/types/ai-search/ai-search.js";
import { Product } from "@/lib/types/product/Product.js";
import BundleCard from "./BundleCard";
import LoadingDots from "./LoadingDots";

interface MessageListProps {
    messages: MessageType[];
    loading: boolean;
    onAddAll: (products: Product[]) => void;
}

export default function MessageList({ messages, loading, onAddAll }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto px-5 py-5">
            {messages.map((msg, i) => {
                if (msg.type === "user") {
                    return (
                        <div key={i} className="flex justify-end animate-[slideUp_0.25s_ease]">
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-sm px-4 py-3 rounded-2xl rounded-br-sm max-w-[70%] leading-relaxed">
                                {msg.text}
                            </div>
                        </div>
                    );
                }
                if (msg.type === "bundle") {
                    return <BundleCard
                        key={i}
                        goal={msg.bundle.goal}
                        reason={msg.bundle.reason}
                        items={msg.bundle.items}
                        onAddAll={onAddAll}
                    />
                }
                if (msg.type === "error") {
                    return (
                        <div
                            key={i}
                            className="self-center bg-red-950/50 border border-red-900/50 text-red-400 text-xs px-4 py-2.5 rounded-xl"
                        >
                            {msg.text}
                        </div>
                    );
                }
            })}

            {loading && <LoadingDots />}
            <div ref={bottomRef} />
        </div>
    );
}