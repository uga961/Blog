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
    sm: "px-3 py-1 text-xs",
    md: "px-3.5 py-1.5 text-xs font-medium",
  };

  const variantStyles = {
    default: active
      ? "bg-foreground text-background font-semibold shadow-xs"
      : "bg-surface-container-highest text-on-surface-variant border border-outline-variant/40 hover:bg-white dark:hover:bg-surface-container-high hover:text-on-surface",
    primary:
      "bg-foreground text-background font-medium shadow-xs",
    tonal:
      "bg-surface-container-high text-on-surface border border-outline-variant/40 font-medium",
    outline:
      "border border-outline-variant/60 text-on-surface-variant bg-transparent",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-all duration-150 select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
