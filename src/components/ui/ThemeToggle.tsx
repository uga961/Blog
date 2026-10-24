"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Returns the current theme from localStorage or system preference.
 * Runs only on the client.
 */
function getStoredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  // Use undefined initial state — we don't guess until mounted
  const [theme, setTheme] = useState<"light" | "dark" | undefined>(undefined);

  useEffect(() => {
    const resolved = getStoredTheme();
    setTheme(resolved);
    // Sync DOM class (in case it drifted)
    document.documentElement.classList.toggle("dark", resolved === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  // Render a skeleton placeholder until client-side JS mounts.
  // This avoids hydration mismatches because the server and first
  // client render both produce the same inert placeholder.
  if (!mounted) {
    return (
      <div
        className={`h-10 w-10 rounded-full bg-surface-container ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-high hover:text-on-surface hover:-translate-y-0.5 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 transition-transform" />
      ) : (
        <Sun className="h-4 w-4 transition-transform" />
      )}
    </button>
  );
}
