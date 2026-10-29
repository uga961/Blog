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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          hover: "hsl(var(--accent-hover))",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          subtle: "hsl(var(--surface-subtle))",
          container: "hsl(var(--surface-container))",
          "container-high": "hsl(var(--surface-container-high))",
          "container-highest": "hsl(var(--surface-container-high))",
          "container-low": "hsl(var(--surface-subtle))",
          "container-lowest": "hsl(var(--surface))",
        },
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "surface-container-highest": "hsl(var(--surface-container-high))",
        "surface-container-low": "hsl(var(--surface-subtle))",
        "surface-container-lowest": "hsl(var(--surface))",
        "on-surface": "hsl(var(--on-surface))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        border: "hsl(var(--border))",
        "border-subtle": "hsl(var(--border-subtle))",
        outline: "hsl(var(--outline))",
        "outline-variant": "hsl(var(--outline-variant))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        raised: "0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
      },
      maxWidth: {
        reading: "740px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "740px",
            color: "hsl(var(--on-surface))",
            lineHeight: "1.8",
            fontSize: "1.125rem",
            p: {
              marginBottom: "1.5em",
            },
            h1: {
              fontFamily: "var(--font-newsreader), Newsreader, Georgia, serif",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: "hsl(var(--foreground))",
            },
            h2: {
              fontFamily: "var(--font-newsreader), Newsreader, Georgia, serif",
              fontWeight: "700",
              letterSpacing: "-0.015em",
              color: "hsl(var(--foreground))",
              marginTop: "2.25em",
              marginBottom: "0.75em",
            },
            h3: {
              fontFamily: "var(--font-newsreader), Newsreader, Georgia, serif",
              fontWeight: "600",
              color: "hsl(var(--foreground))",
              marginTop: "1.75em",
              marginBottom: "0.5em",
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "hsl(var(--border))",
              borderLeftWidth: "2px",
              paddingLeft: "1.25rem",
              color: "hsl(var(--on-surface-variant))",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--surface-subtle))",
              padding: "0.2em 0.4em",
              borderRadius: "3px",
              fontWeight: "500",
              border: "1px solid hsl(var(--border))",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            a: {
              color: "hsl(var(--foreground))",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              "&:hover": {
                color: "hsl(var(--foreground))",
                opacity: "0.8",
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
