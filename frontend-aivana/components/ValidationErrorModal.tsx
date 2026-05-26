"use client";

import { X, FileX } from "lucide-react";

type ValidationFailReason = "MISSING_PACKAGE_JSON" | "INVALID_UI_KIT";

interface ValidationErrorModalProps {
    isOpen: boolean;
    reason: ValidationFailReason;
    onUploadNew: () => void;       
    onContinueWithoutAI: () => void; 
}

const MODAL_CONTENT: Record<
  ValidationFailReason,
  { title: string; description: string }
> = {
    MISSING_PACKAGE_JSON: {
        title: "ไม่พบไฟล์ package.json",
            description:
        "เราไม่พบ package.json ใน ZIP ของคุณ เทมเพลตที่ถูกต้องควรมีไฟล์นี้อยู่ที่ root ของโปรเจกต์",
  },
    INVALID_UI_KIT: {
        title: "ไม่พบไฟล์ดีไซน์",
            description:
        "เราไม่พบไฟล์ดีไซน์ใน ZIP ของคุณ (.fig, .sketch, .xd ฯลฯ) หรือ assets (.svg, .png, fonts)",
  },
};

export default function ValidationErrorModal({
    isOpen,
    reason,
    onUploadNew,
    onContinueWithoutAI,
}: ValidationErrorModalProps) {
    if (!isOpen) return null;

    const content = MODAL_CONTENT[reason];

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onUploadNew()}
        >
            <div className="bg-[#1e1b3d] border border-[#262549] rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
                <button
                    onClick={onUploadNew}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileX className="text-red-400" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {content.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {content.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onUploadNew}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200"
                        >
                            เลือกไฟล์ใหม่ (แนะนำ)
                        </button>
                        <button
                            onClick={onContinueWithoutAI}
                            className="w-full py-3 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-medium rounded-full border border-slate-700 transition-all duration-200"
                        >
                            ดำเนินการต่อโดยไม่ใช้ AI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}