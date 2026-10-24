"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { Check, Copy } from "lucide-react";

/**
 * Recursively extracts plain text from a React node tree.
 * When syntax highlighting (rehype-highlight) runs, code blocks are
 * represented as an array of React element spans instead of a raw string.
 * This ensures the copy button copies clean, uncorrupted code.
 */
function extractPlainText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractPlainText).join("");
  }
  if (React.isValidElement(node)) {
    return extractPlainText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}


/**
 * ReactMarkdown normally wraps standalone Markdown images in <p>.
 * Our custom image renderer returns <figure>, which cannot be nested in <p>.
 * Convert paragraphs containing only an image into <div> before React renders.
 */
function rehypeUnwrapImageParagraphs() {
  return (tree: { children?: Array<any> }) => {
    const visit = (node: any) => {
      if (!node || !Array.isArray(node.children)) return;

      for (const child of node.children) {
        if (
          child.type === "element" &&
          child.tagName === "p" &&
          Array.isArray(child.children)
        ) {
          const meaningfulChildren = child.children.filter(
            (item: any) => !(item.type === "text" && !item.value.trim()),
          );

          if (
            meaningfulChildren.length === 1 &&
            meaningfulChildren[0].type === "element" &&
            meaningfulChildren[0].tagName === "img"
          ) {
            child.tagName = "div";
          }
        }

        visit(child);
      }
    };

    visit(tree);
  };
}

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = async () => {
    try {
      const domText = codeRef.current?.innerText ?? codeRef.current?.textContent;
      const textToCopy = (domText || extractPlainText(children)).replace(/\n$/, "");
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="not-prose relative my-7 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container font-mono text-sm shadow-paper group">
      <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-xs text-on-surface-variant">
        <span className="font-semibold tracking-wider uppercase text-[11px] text-on-surface-variant">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container px-3 py-1 transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:text-foreground hover:-translate-y-0.5 hover:shadow-xs focus-visible:outline-none"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 leading-relaxed text-foreground">
        <code ref={codeRef} className={`${className || ""} block text-foreground font-mono text-sm leading-relaxed`}>{children}</code>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-a:text-foreground prose-a:underline hover:prose-a:opacity-80 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeUnwrapImageParagraphs]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code
                  className="rounded-md bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.875em] text-foreground font-medium border border-outline-variant/30"
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
                  className="w-full rounded-3xl border border-outline-variant/40 object-cover shadow-paper transition-transform"
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
              <div className="my-6 w-full overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface-container/30">
                <table className="w-full text-left text-sm border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-outline-variant/40 bg-surface-container-high px-4 py-3 font-semibold text-on-surface">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-outline-variant/30 px-4 py-3 text-on-surface-variant">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-6 border-l-4 border-foreground/60 bg-surface-container/50 px-5 py-4 italic text-on-surface-variant rounded-r-2xl">
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
