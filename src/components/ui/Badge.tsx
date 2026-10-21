import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "draft" | "scheduled" | "published" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  children,
  className = "",
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-medium",
  };

  const variantStyles = {
    default: "bg-muted text-foreground border border-border/70",
    accent: "bg-accent/10 text-accent border border-accent/20 font-medium",
    draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium",
    scheduled: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 font-medium",
    published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium",
    outline: "border border-border text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
