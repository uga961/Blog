"use client";

import React, { useState } from "react";
import { TocItem } from "@/lib/markdown";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length < 2) return null;

  return (
    <div className="my-8 rounded-xl border border-border/70 bg-card p-4 transition-all shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground"
      >
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-accent" />
          <span>Table of Contents</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <nav className="mt-3.5 space-y-1.5 border-t border-border/50 pt-3">
          {items.map((item, index) => (
            <a
              key={index}
              href={`#${item.id}`}
              className={`block text-sm text-muted-foreground transition-colors hover:text-accent ${
                item.level === 3 ? "pl-4 text-xs" : "font-medium"
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
