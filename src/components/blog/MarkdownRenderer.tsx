"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative my-7 overflow-hidden rounded-2xl border border-outline-variant/35 bg-surface-container font-mono text-sm shadow-xs group">
      <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-high px-4 py-2.5 text-xs text-on-surface-variant">
        <span className="font-semibold tracking-wider uppercase text-[11px]">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 transition-colors hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline-none"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] text-primary font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 leading-relaxed">
        <code className={className}>{children}</code>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code
                  className="rounded-md bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.875em] text-primary font-medium border border-outline-variant/25"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          img({ src, alt }) {
            if (!src) return null;
            return (
              <figure className="my-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || ""}
                  className="w-full rounded-3xl border border-outline-variant/30 object-cover shadow-sm transition-transform"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="mt-2.5 text-center text-xs text-on-surface-variant italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          table({ children }) {
            return (
              <div className="my-6 w-full overflow-x-auto rounded-2xl border border-outline-variant/30">
                <table className="w-full text-left text-sm border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-outline-variant/30 bg-surface-container-high px-4 py-3 font-semibold text-on-surface">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-outline-variant/20 px-4 py-3 text-on-surface-variant">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-6 border-l-4 border-primary bg-primary-container/20 px-5 py-4 italic text-on-surface-variant rounded-r-2xl">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
