"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only track pointer coordinates on devices with fine hover capability (mouse/trackpad).
    // Touch screens will bypass all mousemove listeners and getBoundingClientRect calls,
    // eliminating forced reflows and stuttering during scroll.
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => canHover && setOpacity(1);
  const handleBlur = () => setOpacity(0);
  const handleMouseEnter = () => canHover && setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onFocus={canHover ? handleFocus : undefined}
      onBlur={canHover ? handleBlur : undefined}
      onMouseEnter={canHover ? handleMouseEnter : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      className={cn(
        "relative rounded-2xl border border-outline-variant/40 bg-surface-container/60 p-6 sm:backdrop-blur-sm transition-all duration-200 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-[var(--card-hover-shadow)] shadow-[var(--card-shadow)] overflow-hidden group [content-visibility:auto] [contain-intrinsic-size:240px]",
        className
      )}
      {...props}
    >
      {/* Subtle, soft touch-up spotlight sheen (active on desktop mouse pointer only) */}
      {canHover && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(180px circle at ${position.x}px ${position.y}px, ${spotlightColor || "var(--spotlight-surface)"}, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
