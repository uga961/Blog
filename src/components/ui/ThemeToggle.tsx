"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDark = document.documentElement.classList.contains("dark");
    setIsDark(hasDark);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
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
