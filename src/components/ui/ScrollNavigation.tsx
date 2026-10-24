"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export function ScrollNavigation() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollMetrics = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;

      // Only show if the page is long enough to scroll
      setIsScrollable(maxScroll > 300);

      // Show "Go to Top" if scrolled down more than 200px
      setShowTop(scrollY > 200);

      // Show "Go to Bottom" if not already near the bottom (more than 200px from bottom)
      setShowBottom(scrollY < maxScroll - 200);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollMetrics);
        ticking = true;
      }
    };

    // Defer initial layout measurement until after initial paint & idle time
    // to prevent synchronous forced reflow during page load
    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(updateScrollMetrics, { timeout: 1500 })
        : setTimeout(updateScrollMetrics, 600);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (typeof window.cancelIdleCallback === "function" && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId as NodeJS.Timeout);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!isScrollable) return null;

  return (
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-2 transition-all duration-300"
      aria-label="Page scroll navigation"
    >
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-container-high/90 text-foreground backdrop-blur-md shadow-paper transition-all duration-200 hover:scale-105 hover:bg-white dark:hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline ${
          showTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      {/* Scroll to Bottom Button */}
      <button
        onClick={scrollToBottom}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-container-high/90 text-foreground backdrop-blur-md shadow-paper transition-all duration-200 hover:scale-105 hover:bg-white dark:hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline ${
          showBottom
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        title="Scroll to bottom"
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </div>
  );
}
