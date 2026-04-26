'use client';
import { Send } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function SearchInput({value, onChange, onSubmit, disabled}:SearchInputProps) {
    return (
        <div className="px-12 py-4 border-t border-[#1e1b3d] bg-[#0f0d24]/95 backdrop-blur-sm">
            <div
                className={`flex gap-2.5 items-center bg-[#1a1735] border rounded-2xl px-4 py-2 transition-all duration-200 ${disabled
                        ? "border-[#262449] opacity-60"
                        : "border-[#262449] focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/20"
                    }`}
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !disabled && onSubmit()}
                    placeholder="เช่น เทมเพลตเว็บ ecommerce ใช้ React ขอ UI simple ..."
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm placeholder:text-slate-600 py-1.5"
                />
                <button
                    onClick={onSubmit}
                    disabled={!value.trim() || disabled}
                    className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white transition-opacity hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Send size={14} />
                </button>
            </div>
        </div>
    );
}