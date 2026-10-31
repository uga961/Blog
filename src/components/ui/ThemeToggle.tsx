"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  const syncTheme = useCallback(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);
  }, []);

  useEffect(() => {
    setMounted(true);
    syncTheme();

    // Observe changes to the <html> element's class attribute so all toggles stay 100% in sync
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          syncTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen to cross-tab storage events and custom theme-change events
    window.addEventListener("theme-change", syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("theme-change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, [syncTheme]);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(nextDark);
    window.dispatchEvent(
      new CustomEvent("theme-change", { detail: { isDark: nextDark } })
    );
  };

  if (!mounted) {
    return (
      <div
        className={`w-8 h-8 rounded-[3px] border border-border/80 bg-surface/50 flex items-center justify-center ${className}`}
      >
        <div className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle color theme"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`w-8 h-8 rounded-[3px] border border-border/80 bg-surface/50 hover:bg-surface hover:border-foreground/40 flex items-center justify-center transition-colors text-foreground touch-manipulation cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-on-surface-variant hover:text-foreground transition-colors" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-on-surface-variant hover:text-foreground transition-colors" />
      )}
    </button>
  );
}
