import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "tonal" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "filled",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono font-medium rounded-[4px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:opacity-40 disabled:pointer-events-none select-none touch-manipulation";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[36px]",
      md: "text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 gap-2 min-h-[40px]",
      lg: "text-sm uppercase tracking-wider px-6 py-3 gap-2.5 min-h-[44px]",
    };

    const variantStyles = {
      filled:
        "bg-foreground text-background hover:bg-foreground/90",
      tonal:
        "bg-surface-subtle text-foreground border border-border/80 hover:bg-surface-container",
      outlined:
        "border border-border/90 bg-surface/80 text-foreground hover:border-foreground",
      text:
        "text-on-surface-variant hover:text-foreground",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
