"use client";

import React, { useState } from "react";
import { TocItem } from "@/lib/markdown";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length < 2) return null;

  return (
    <div className="my-8 rounded-3xl border border-outline-variant/40 bg-surface-container p-5 transition-all shadow-paper">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-xs font-semibold tracking-wider uppercase text-on-surface-variant hover:text-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-foreground">
            <List className="h-3.5 w-3.5" />
          </div>
          <span>Table of Contents</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <nav className="mt-4 space-y-2 border-t border-outline-variant/30 pt-4">
          {items.map((item, index) => (
            <a
              key={index}
              href={`#${item.id}`}
              className={`block text-sm text-on-surface-variant transition-colors hover:text-foreground ${
                item.level === 3 ? "pl-5 text-xs" : "font-medium"
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
