import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "tonal" | "outline";
  size?: "sm" | "md";
  active?: boolean;
}

export function Badge({
  children,
  className = "",
  variant = "default",
  size = "sm",
  active = false,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  const variantStyles = {
    default: active
      ? "bg-foreground text-background font-semibold"
      : "bg-surface-subtle text-on-surface-variant border border-border/80 hover:border-foreground/40 hover:text-foreground",
    primary:
      "bg-foreground text-background font-medium",
    tonal:
      "bg-surface-container text-foreground border border-border/80 font-medium",
    outline:
      "border border-border/80 text-on-surface-variant bg-transparent hover:border-foreground/40 hover:text-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[3px] font-mono transition-colors select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
