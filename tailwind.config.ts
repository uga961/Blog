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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          subtle: "hsl(var(--accent-subtle))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-newsreader)", "Charter", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        reading: "720px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "720px",
            color: "hsl(var(--foreground))",
            lineHeight: "1.8",
            fontSize: "1.125rem",
            p: {
              marginBottom: "1.5em",
            },
            h1: {
              fontFamily: "var(--font-newsreader), Charter, Georgia, serif",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: "hsl(var(--foreground))",
            },
            h2: {
              fontFamily: "var(--font-newsreader), Charter, Georgia, serif",
              fontWeight: "600",
              letterSpacing: "-0.015em",
              color: "hsl(var(--foreground))",
              marginTop: "2em",
              marginBottom: "0.75em",
            },
            h3: {
              fontFamily: "var(--font-newsreader), Charter, Georgia, serif",
              fontWeight: "600",
              color: "hsl(var(--foreground))",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "hsl(var(--accent))",
              borderLeftWidth: "3px",
              paddingLeft: "1.25rem",
              color: "hsl(var(--muted-foreground))",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            a: {
              color: "hsl(var(--accent))",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": {
                color: "hsl(var(--accent-hover))",
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
