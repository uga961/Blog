# Ugandhar Vaddi — Thoughts & Technical Journal

Official repository for [thoughts.ugandhar.in](https://thoughts.ugandhar.in).

A high-performance, file-based personal technical thoughts, essays, and engineering diary built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. Designed with an architectural, minimal editorial aesthetic synchronized with [ugandhar.in](https://www.ugandhar.in) — high-contrast typography, hairline borders, generous whitespace, real-time audio telemetry, and 100% pure Markdown content delivery with zero external database dependencies.

---

## 🏛 Design System & Architecture

The site is engineered to match the precision and elegance of the portfolio site while delivering an optimal long-form reading experience:

- **Minimal Editorial Architecture**: Clean horizontal divider rules (`border-b border-border/80`), structured index numbers (`INDEX 001`, `INDEX 002`, `INDEX 003`...), and intentional whitespace.
- **Tri-Font Typographic Hierarchy**:
  - **Newsreader** (Editorial serif italic): Headlines, titles, and reflective quotes.
  - **Geist Sans**: Clean, modern prose and UI elements.
  - **Geist Mono**: Dates, metadata badges, technical metrics, and code snippets.
- **Editorial Color Palette**:
  - **Light Mode**: Warm bone parchment (`#F8F7F4`), crisp near-black charcoal ink (`#161616`), hairline dividers (`#E4E1DB`).
  - **Dark Mode**: Deep carbon obsidian (`#121211`), warm bone typography (`#E8E6DF`), carbon hairline borders (`#262624`).
  - Zero FOUC (Flash of Unstyled Content) via inline DOM theme script.
- **Gecko & Mobile Optimization**:
  - Non-blocking bottom navigation dock with `gpu-layer` compositing.
  - Mobile touch targets (`min-h-[40px]`) and `touch-manipulation` for instant response.

---

## ⚡ Features & Capabilities

- 📝 **Pure File-Based Markdown Publishing**: Drop any `.md` file with frontmatter into `/posts` to publish instantly.
- ⏱️ **Automatic Last Updated Detection**: Every post tracks its last updated date and time automatically using filesystem modification timestamps or git history.
- 🔀 **Flexible Article View**: Toggle seamlessly between **Editorial List View** (dates, tags, arrows) and **Card Grid View** (cover images, metadata).
- 🔍 **Live Search & Filter**: Real-time client-side search across article titles, tags, and excerpts.
- 🎵 **Live Spotify Turntable & Last.fm Telemetry**: Spinning vinyl record player that displays the current song playing (or recently scrobbled via Last.fm / Spotify API) with play/pause controls and optional mini-player.
- 🛠️ **Currently Building Section**: Live telemetry of active open-source engineering projects (e.g. TV Detox).
- 📋 **1-Click Code Copy**: Syntax-highlighted code blocks with clean DOM text extraction and copy confirmation.
- 📑 **Collapsible Table of Contents**: Automatically extracts `##` and `###` headings into a jump-nav outline.
- 🌐 **Maximum SEO & Search Console Readiness**:
  - Pre-configured Google Search Console verification code.
  - Bing IndexNow protocol (`scripts/submit-indexnow.mjs` and `/api/indexnow`).
  - Google Schema.org structured data (`WebSite`, `Person`, `Blog`, `BlogPosting`, `BreadcrumbList`).
  - Dynamic `sitemap.xml` with priority, change frequency, and last modified dates.
  - Fully compliant `robots.txt` allowing crawler indexation.
  - Standard RSS 2.0 XML feed at `/feed.xml` and `/rss.xml` for portfolio synchronization.
- 🔒 **Security First**: Secrets (`SPOTIFY_CLIENT_SECRET`, `LASTFM_API_KEY`) strictly isolated to server runtimes. Protected against route probes and sensitive dotfile leaks.
- 📊 **Vercel Analytics & Speed Insights**: Real-time performance tracking and web vitals monitoring.

---

## 📂 Project Directory Structure

```
Thoughts/
├── posts/                          # Published markdown articles
│   ├── debloat-android-tv-adb-guide.md
│   ├── i-decided-to-start-this-again.md
│   ├── mckinsey-interview-day-and-results.md
│   ├── python-data-visualization-matplotlib-seaborn-guide.md
│   ├── rbi-500-rupee-note-quality-control.md
│   └── why-i-built-stayactive.md
├── templates/
│   └── post-template.md            # Starter template for new articles
├── public/
│   ├── avatar/                     # High-resolution author portrait
│   ├── social/                     # OpenGraph sharing images
│   ├── 2f8745c1a89b4f99a071de8463990b76.txt # Bing IndexNow key file
│   ├── Logo.png                    # Brand emblem
│   ├── icon.png                    # App icon
│   └── favicon.ico                 # Browser tab favicon
├── scripts/
│   ├── submit-indexnow.mjs         # Push all URLs to Bing / Copilot
│   ├── update-post-dates.mjs       # Automatic date auditing script
│   └── get-spotify-token.mjs       # Helper to generate Spotify refresh token
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── spotify/route.ts    # Server-side music telemetry
│   │   │   └── indexnow/route.ts   # IndexNow endpoint
│   │   ├── feed.xml/route.ts       # RSS 2.0 XML feed
│   │   ├── posts/[slug]/page.tsx   # Individual article view
│   │   ├── globals.css             # Architectural CSS tokens & code highlighting
│   │   ├── layout.tsx              # Root HTML, fonts, JSON-LD, Analytics
│   │   ├── not-found.tsx           # Editorial 404 page (no soft 404s)
│   │   ├── page.tsx                # Homepage (Hero, Featured, Activity, Articles)
│   │   ├── robots.ts               # Robots.txt route
│   │   └── sitemap.ts              # Dynamic sitemap route
│   ├── components/
│   │   ├── thoughts/
│   │   │   ├── ActivityShowcase.tsx # Live building + Spotify turntable
│   │   │   ├── ArticleCard.tsx     # List view article row
│   │   │   ├── ArticleGridCard.tsx # Grid view article card
│   │   │   ├── ArticleList.tsx     # Filter, search, and view toggle
│   │   │   ├── HeroBanner.tsx      # Author introduction & portrait
│   │   │   ├── MarkdownRenderer.tsx# Markdown parser with 1-click code copy
│   │   │   ├── ReadingProgressBar.tsx # Reading progress line
│   │   │   ├── ShareButtons.tsx    # Share to WhatsApp, LinkedIn, X, Copy Link
│   │   │   └── TableOfContents.tsx # Collapsible article outline
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Minimal top navigation
│   │   │   └── Footer.tsx          # Index 005 contact block & bottom links
│   │   └── ui/
│   │       ├── MagneticDock.tsx    # Floating quick-navigation dock
│   │       └── ThemeToggle.tsx     # Dark / light mode toggle
│   ├── lib/
│   │   ├── config.ts               # Author, bio, and social config
│   │   ├── date.ts                 # Date formatting utilities
│   │   ├── markdown.ts             # Table of contents parser
│   │   ├── music.ts                # Last.fm & Spotify telemetry resolver
│   │   ├── posts.ts                # Markdown loader & reading time calculation
│   │   ├── slug.ts                 # URL slug sanitizer
│   │   ├── spotify.ts              # Spotify API client
│   │   └── utils.ts                # Tailwind class merge helper
├── template.md                     # Root copyable article template
├── next.config.ts                  # Security headers, rewrites, remote images
├── tailwind.config.ts              # Palette tokens & typography plugin
└── package.json
```

---

## ✍️ How to Publish a New Article

### 1. Copy the Starter Template
Copy `template.md` into the `posts/` folder:

```bash
cp template.md posts/my-new-post.md
```

### 2. Configure Frontmatter
Open `posts/my-new-post.md` and adjust the frontmatter:

```yaml
---
title: "Your Post Title Here"
slug: "your-post-title-here"
date: "2026-10-31"
# Optional: leave blank and the system will automatically detect the last modified date!
lastUpdated: ""
excerpt: "A short 1-2 sentence preview or hook describing what this article covers."
tags: ["Technology", "Engineering"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
author: "Ugandhar"
published: true
---
```

> **Drafts**: Set `published: false` to keep an article private locally without showing up on the live site.

### 3. Write Your Content
Write your article using standard GitHub Flavored Markdown (`##`, `###`, tables, code blocks, blockquotes, images).

### 4. Build & Preview
Run development server to preview locally:

```bash
npm run dev
```

Visit `http://localhost:3000/posts/your-post-title-here`.

---

## 🕒 Automatic Last Updated Date Script

Every article automatically receives a `lastUpdated` timestamp from the filesystem or git commit date. To audit or regenerate timestamps across all markdown files:

```bash
npm run update-dates
```

---

## 🚀 Push to Search Engines (IndexNow)

To instantly submit all articles to Microsoft Bing and Copilot:

```bash
npm run indexnow
```

---

## 🎵 Spotify & Last.fm Configuration

Add your API credentials to `.env.local` (never committed to Git):

```env
# Spotify Integration
SPOTIFY_CLIENT_ID="your_client_id"
SPOTIFY_CLIENT_SECRET="your_client_secret"
SPOTIFY_REFRESH_TOKEN="your_refresh_token"

# Last.fm Integration (Live scrobbling from Spotify)
LASTFM_USERNAME="uga961"
LASTFM_API_KEY="your_lastfm_api_key"

# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="d6qC6JXOnKpcVtH15DHGM1LslxfSPMTZd2mavDkuMY8"
```

---

## 🛠️ Development & Production Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Compiles production build and SSG static HTML pages |
| `npm run start` | Starts production server |
| `npm run lint` | Runs Next.js ESLint and TypeScript checks |
| `npm run test` | Runs Vitest automated test suite |
| `npm run update-dates`| Audits post modification dates |
| `npm run indexnow` | Submits all URLs to Bing & Copilot |

---

## 🚀 Deploying to Vercel (Step-by-Step)

Deploying to Vercel takes less than 2 minutes:

1. **Import Project into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository: `uga961/Thoughts`.

2. **Configure Project Settings**:
   - **Framework Preset**: `Next.js` (detected automatically)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (or leave default `next build`)
   - **Output Directory**: `.next` (leave default)
   - **Install Command**: `npm install` (leave default)

3. **Set Environment Variables**:
   In the **Environment Variables** section of the Vercel project configuration, add:
   - `SPOTIFY_CLIENT_ID` = `YOUR_KEY`
   - `SPOTIFY_CLIENT_SECRET` = `YOUR_KEY`
   - `SPOTIFY_REFRESH_TOKEN` = `YOUR_KEY`
   - `LASTFM_USERNAME` = `YOUR_USER_NAME`
   - `LASTFM_API_KEY` = `YOUR_KEY`
   - `INDEXNOW_KEY` = `YOUR_KEY`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = `YOUR_KEY`

4. **Deploy**:
   - Click **Deploy**. Vercel will build the project and output your live deployment preview.

5. **Connect Custom Domain (`thoughts.ugandhar.in`)**:
   - In your Vercel Project Dashboard, navigate to **Settings** → **Domains**.
   - Add `thoughts.ugandhar.in`.
   - Vercel will prompt you to add a **CNAME** DNS record at your domain registrar:
     - **Type**: `CNAME`
     - **Name / Host**: `thoughts`
     - **Value / Target**: `cname.vercel-dns.com`
   - Within minutes, SSL certificates generate automatically and site goes live!

---

## 📄 License

MIT © [Ugandhar Vaddi](https://www.ugandhar.in)
