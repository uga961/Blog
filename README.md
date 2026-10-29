# Ugandhar Vaddi — Personal Blog

A fast, file-based personal blog built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**, designed with a **minimal editorial engineering aesthetic**.

Synchronized with the design system of [ugandhar.in](https://www.ugandhar.in) — high-contrast typography, hairline borders, generous whitespace, and pure Markdown content delivery. Zero database overhead, no external CMS.

---

## Design System & Aesthetic

- **Minimal Editorial Architecture:** Clean horizontal divider rules (`border-b border-border/80`), structured index numbers (`INDEX 001`, `INDEX 002`...), and intentional whitespace.
- **Color Palette:**
  - **Light Mode:** Warm bone parchment (`#F8F7F4`), crisp near-black ink text (`#161616`), hairline dividers (`#E4E1DB`).
  - **Dark Mode:** Deep obsidian carbon canvas (`#121211`), warm bone typography (`#E8E6DF`), carbon hairline borders (`#262624`).
- **Typography:** Tri-font hierarchy combining `Newsreader` editorial serif (for titles and headlines), `Geist Sans` (for clean prose and UI), and `Geist Mono` (for metadata, dates, and code).
- **Restrained Geometric System:** Standardized 2–4px radii for interactive elements, 4–6px for figures, eliminating bloated AI-generated card and pill loops.
- **Gecko & Mobile Optimization:** Dedicated GPU layer promotion (`.gpu-layer`), zero-transform centered bottom navigation dock, `optimizeSpeed` body rendering, and smooth cross-platform scrolling.

---

## Features

- 📝 **File-Based Markdown Publishing:** Drop any `.md` file with frontmatter into `posts/` to publish instantly. Supports reading time, TOC extraction, and tagging.
- 🔍 **Live Search & Filter:** Instant client-side search across titles, excerpts, and keywords with `.no-scrollbar` tag filtering.
- 🎵 **Live Telemetry & Spotify:** Real-time audio stream indicator and turntable playback integration with Last.fm and Spotify API.
- 💻 **Active Workspace Showcase:** Direct links and live status for open-source engineering builds (e.g. [StayActive](https://github.com/uga961/StayActive)).
- 🧭 **Mathematical Centering Dock:** Non-blocking quick-navigation dock with zero transform collisions across mobile, Safari, and Firefox.
- 📋 **1-Click Code Copy:** Syntax-highlighted code blocks with clean DOM text extraction and custom copy confirmation.
- 🌐 **Comprehensive SEO & Structured Data:**
  - Google Schema.org JSON-LD (`WebSite` + `Person` on root, `BlogPosting` on all article pages).
  - OpenGraph & Twitter Cards.
  - Native Next.js 15 `sitemap.xml` and `robots.txt` generation.
  - RSS 2.0 feed available at `/feed.xml`.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/uga961/Blog.git
cd Blog

# 2. Install dependencies (locally in node_modules, no global packages needed)
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Add a New Post

1. Copy `template.md` into the `posts/` directory:
   ```bash
   cp template.md posts/my-new-essay.md
   ```

2. Update the YAML frontmatter:
   ```yaml
   ---
   title: "Your Essay Title Here"
   slug: "your-essay-slug"
   date: "2026-10-30"
   excerpt: "A short 1-2 sentence preview or hook describing what this article covers."
   tags: ["Technology", "Engineering"]
   coverImage: "https://images.unsplash.com/photo-..."
   author: "Ugandhar Vaddi"
   published: true
   ---
   ```

3. Write your content in Markdown below the frontmatter.
4. Save the file — the blog automatically detects, builds, and renders the article at `/posts/your-essay-slug`.

---

## Verification & Commands

```bash
# Type check the entire codebase
npm run lint

# Run Vitest unit tests
npm run test

# Production build and SSG static page generation
npm run build
```

---

## License

MIT © [Ugandhar Vaddi](https://www.ugandhar.in)
