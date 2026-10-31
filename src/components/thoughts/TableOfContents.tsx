"use client";

import React, { useState } from "react";
import { TocItem } from "@/lib/markdown";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length < 2) return null;

  return (
    <div className="my-8 rounded-[4px] border border-border/80 bg-surface/60 p-4 sm:p-5 shadow-subtle transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-xs font-mono font-semibold tracking-wider uppercase text-on-surface-variant hover:text-foreground cursor-pointer touch-manipulation"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[2px] border border-border/80 bg-surface text-foreground">
            <List className="h-3 w-3" />
          </div>
          <span>Outline &amp; Table of Contents</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {isOpen && (
        <nav className="mt-3.5 space-y-1.5 border-t border-border/60 pt-3.5">
          {items.map((item, index) => (
            <a
              key={index}
              href={`#${item.id}`}
              className={`block text-xs font-mono text-on-surface-variant transition-colors hover:text-foreground hover:underline ${
                item.level === 3 ? "pl-4 text-[11px]" : "font-medium"
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
