"use client";

import { Sparkles, ChevronRight } from "lucide-react";

const SUGGESTION_PROMPTS = [
  "เทมเพลตเว็บ ecommerce ใช้ React ขอ UI simple",
  "API สำหรับระบบตะกร้าสินค้า (add/remove/update)",
  "ออกแบบ UI หน้า Product Card ให้ดู modern",
  "เขียนระบบค้นหาสินค้าแบบมี filter + sort",
];

interface EmptyStateProps {
  onSuggestionClick: (prompt: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center gap-3 px-6 animate-[fadeIn_0.4s_ease]">
      {/* Orb */}
      <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 flex items-center justify-center mb-2 animate-pulse">
        <Sparkles size={32} className="text-violet-400" />
      </div>

      <h2 className="text-xl font-bold text-slate-100">บอกฉันว่าคุณต้องการอะไร</h2>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed">
        AI จะแนะนำชุดสินค้าที่เหมาะสมกับความต้องการและงานของคุณ
      </p>
      <p className="text-sm text-slate-500 max-w-max leading-relaxed mt-2">
        ลองระบุ tech stack ที่ใช้, environment ที่ทำงานอยู่ และ keyword สำคัญของโปรเจกต์ เพื่อให้คำแนะนำแม่นยำมากขึ้น เช่น: "React + Tailwind, ทำเว็บ ecommerce, มีระบบ cart และ payment"
      </p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {SUGGESTION_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSuggestionClick(prompt)}
            className="flex items-center gap-1 bg-[#1a1735] border border-[#262449] text-slate-400 text-sm px-4 py-2 rounded-full hover:bg-violet-500/10 hover:border-violet-500 hover:text-slate-100 transition-all duration-200"
          >
            {prompt}
            <ChevronRight size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}