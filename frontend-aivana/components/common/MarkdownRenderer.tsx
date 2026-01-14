"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg p-4 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
          p: ({ children }) => (
            <p className="text-slate-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 text-slate-300 marker:text-purple-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 text-slate-300 marker:text-purple-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 pl-4 italic text-slate-400 my-4">
              {children}
            </blockquote>
          ),
          code({ className, children }) {
            const isBlock = className?.startsWith("language-");
            return isBlock ? (
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm text-slate-200 mb-4">
                <code>{children}</code>
              </pre>
            ) : (
              <code className="bg-slate-700 px-1 py-0.5 rounded text-purple-300">
                {children}
              </code>
            );
          },
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
