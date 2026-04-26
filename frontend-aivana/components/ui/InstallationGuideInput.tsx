"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/Textarea";

interface InstallationGuideInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const InstallationGuideInput: React.FC<
    InstallationGuideInputProps
> = ({ value, onChange }) => {
    const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                    Installation Guide (Markdown supported) - คำแนะนำการติดตั้ง (รองรับ Markdown)
                </label>

                <div className="flex gap-2 text-sm">
                    <button
                        type="button"
                        onClick={() => setPreviewMode("edit")}
                        className={`px-3 py-1 rounded ${previewMode === "edit"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 text-slate-300"
                            }`}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewMode("preview")}
                        className={`px-3 py-1 rounded ${previewMode === "preview"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 text-slate-300"
                            }`}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Edit Mode */}
            {previewMode === "edit" && (
                <Textarea
                    label="Installation Guide (คำแนะนำการติดตั้ง - ใช้ Markdown ได้)"
                    value={value}
                    onChange={onChange}
                    placeholder={`## Installation\n\n1. Download the file\n2. Install dependencies\n3. Run the app`}
                    rows={6}
                />

            )}

            {/* Preview Mode */}
            {previewMode === "preview" && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    {value ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                /* HEADINGS */
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold mt-6 mb-4 text-white">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-semibold mt-5 mb-3 text-white">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-semibold mt-4 mb-2 text-white">
                                        {children}
                                    </h3>
                                ),
                                h4: ({ children }) => (
                                    <h4 className="text-lg font-medium mt-3 mb-2 text-white">
                                        {children}
                                    </h4>
                                ),
                                h5: ({ children }) => (
                                    <h5 className="text-base font-medium mt-2 mb-1 text-white">
                                        {children}
                                    </h5>
                                ),
                                h6: ({ children }) => (
                                    <h6 className="text-sm font-medium mt-2 mb-1 text-slate-300">
                                        {children}
                                    </h6>
                                ),

                                /* PARAGRAPH */
                                p: ({ children }) => (
                                    <p className="text-slate-300 mb-3 leading-relaxed">
                                        {children}
                                    </p>
                                ),

                                /* LISTS */
                                ul: ({ children }) => (
                                    <ul className="list-disc pl-6 mb-4 text-slate-300">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal pl-6 mb-4 text-slate-300">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="mb-1">{children}</li>
                                ),

                                /* BLOCKQUOTE */
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-slate-400 my-4">
                                        {children}
                                    </blockquote>
                                ),

                                /* CODE */
                                code({ className, children }) {
                                    const isBlock = className?.startsWith("language-");

                                    return isBlock ? (
                                        <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm text-slate-200 mb-4">
                                            <code className={className}>{children}</code>
                                        </pre>
                                    ) : (
                                        <code className="bg-slate-700 px-1 py-0.5 rounded text-purple-300">
                                            {children}
                                        </code>
                                    );
                                },

                                /* TABLES */
                                table: ({ children }) => (
                                    <table className="border-collapse border border-slate-600 my-4 w-full">
                                        {children}
                                    </table>
                                ),
                                th: ({ children }) => (
                                    <th className="border border-slate-600 px-3 py-2 bg-slate-700 text-white text-left">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="border border-slate-600 px-3 py-2 text-slate-300">
                                        {children}
                                    </td>
                                ),
                            }}
                        >
                            {value}
                        </ReactMarkdown>


                    ) : (
                        <p className="text-slate-400">Nothing to preview</p>
                    )}
                </div>
            )}

        </div>
    );
};
