"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * Editorial surface container: restrained borders, subtle surface tint,
 * purposeful interaction states without AI-style glowing halos.
 */
export function SpotlightCard({
  children,
  className,
  ...props
}: SpotlightCardProps) {
  // Delete legacy property if present
  delete (props as Record<string, unknown>).spotlightColor;

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border/80 bg-surface/60 dark:bg-surface/40 p-5 sm:p-6 transition-all duration-200 hover:border-foreground/30 hover:bg-surface dark:hover:bg-surface/70 group",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
