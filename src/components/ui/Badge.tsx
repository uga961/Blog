import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "accent";
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "border-border/80 bg-surface/50 text-on-surface-variant",
    outline: "border-border text-foreground",
    accent: "border-accent/40 bg-accent/10 text-accent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border px-2 py-0.5 text-[11px] font-mono",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
