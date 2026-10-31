"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Activity,
  Globe,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface DockItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

export function MagneticDock({ className }: { className?: string }) {
  const items: DockItem[] = [
    { label: "Top", href: "/#hero", icon: <Home className="w-3.5 h-3.5" /> },
    { label: "Articles", href: "/#articles", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: "Activity", href: "/#activity", icon: <Activity className="w-3.5 h-3.5" /> },
    {
      label: "Portfolio",
      href: "https://www.ugandhar.in",
      icon: <Globe className="w-3.5 h-3.5" />,
      external: true,
    },
    { label: "Contact", href: "/#contact", icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-3 sm:bottom-4 inset-x-0 z-50 flex items-center justify-center pointer-events-none",
        className
      )}
    >
      <nav
        aria-label="Quick Navigation"
        className="pointer-events-auto flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-[4px] border border-border/90 bg-background/95 sm:bg-background/90 sm:backdrop-blur-md shadow-subtle text-xs font-mono gpu-layer"
      >
        {items.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-on-surface-variant hover:text-foreground hover:bg-surface-subtle transition-colors touch-manipulation"
              >
                {item.icon}
                <span className="hidden sm:inline text-[11px]">{item.label}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-60 hidden sm:inline" />
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-on-surface-variant hover:text-foreground hover:bg-surface-subtle transition-colors touch-manipulation"
            >
              {item.icon}
              <span className="hidden sm:inline text-[11px]">{item.label}</span>
            </Link>
          );
        })}

        <div className="w-[1px] h-3.5 bg-border/80 mx-0.5 sm:mx-1 flex-shrink-0" />

        <ThemeToggle />
      </nav>
    </div>
  );
}
