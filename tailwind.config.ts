import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          container: "hsl(var(--primary-container))",
          "on-container": "hsl(var(--primary-on-container))",
          hover: "hsl(var(--primary-hover))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          "container-lowest": "hsl(var(--surface-container-lowest))",
          "container-low": "hsl(var(--surface-container-low))",
          container: "hsl(var(--surface-container))",
          "container-high": "hsl(var(--surface-container-high))",
          "container-highest": "hsl(var(--surface-container-highest))",
        },
        "surface-container-lowest": "hsl(var(--surface-container-lowest))",
        "surface-container-low": "hsl(var(--surface-container-low))",
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "surface-container-highest": "hsl(var(--surface-container-highest))",
        "on-surface": "hsl(var(--on-surface))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        outline: "hsl(var(--outline))",
        "outline-variant": "hsl(var(--outline-variant))",
      },
      borderRadius: {
        "m3-xs": "4px",
        "m3-sm": "8px",
        "m3-md": "12px",
        "m3-lg": "16px",
        "m3-xl": "28px",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        paper: "0 8px 24px -6px rgba(35, 30, 20, 0.08), 0 2px 6px -1px rgba(35, 30, 20, 0.03)",
        "paper-dark": "0 12px 28px -6px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(222, 219, 200, 0.08)",
        "glow-sm": "0 0 15px -3px hsl(var(--primary) / 0.25)",
        "glow-md": "0 0 25px -4px hsl(var(--primary) / 0.35)",
        "glow-lg": "0 0 45px -5px hsl(var(--primary) / 0.45)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Roboto", "-apple-system", "sans-serif"],
        serif: ["var(--font-newsreader)", "Charter", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        reading: "760px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "760px",
            color: "hsl(var(--on-surface))",
            lineHeight: "1.8",
            fontSize: "1.125rem",
            p: {
              marginBottom: "1.5em",
            },
            h1: {
              fontFamily: "var(--font-newsreader), Charter, Georgia, serif",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: "hsl(var(--on-surface))",
            },
            h2: {
              fontFamily: "var(--font-newsreader), Charter, Georgia, serif",
              fontWeight: "600",
              letterSpacing: "-0.015em",
              color: "hsl(var(--on-surface))",
              marginTop: "2em",
              marginBottom: "0.75em",
            },
            h3: {
              fontFamily: "var(--font-newsreader), Charter, Georgia, serif",
              fontWeight: "600",
              color: "hsl(var(--on-surface))",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "hsl(var(--primary))",
              borderLeftWidth: "3px",
              paddingLeft: "1.25rem",
              color: "hsl(var(--on-surface-variant))",
            },
            code: {
              color: "hsl(var(--primary))",
              backgroundColor: "hsl(var(--surface-container-high))",
              padding: "0.2em 0.4em",
              borderRadius: "0.375rem",
              fontWeight: "500",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              "&:hover": {
                color: "hsl(var(--primary-hover))",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
