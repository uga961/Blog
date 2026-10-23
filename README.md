# Ugandhar Vaddi — Personal Blog & Engineering Journal

A fast, minimalist, file-based personal blogging platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Material 3** design tokens. 

Zero database overhead, no external CMS — write your content in standard Markdown, commit to Git, and publish instantly.

---

## Features

- 📝 **File-Based Markdown Publishing:** Posts live as standard `.md` files in `/posts` with YAML frontmatter, automatic reading-time calculation, table of contents extraction, and tag support.
- 🎨 **Material 3 Design System:** Full M3 color tokens (primary green tonal containers, adaptive surfaces, custom typography pairing Geist Sans, Geist Mono, and Newsreader serif).
- 🌓 **Dark & Light Mode:** Flash-free inline hydration script and smooth theme toggle with no hydration mismatches.
- 🔍 **Live Search:** Fast client-side search across titles, excerpts, and post contents on the homepage.
- 🎵 **Live Spotify Turntable:** Animated 33 RPM spinning vinyl record showcasing your real-time live playback via free Last.fm scrobbling or native Spotify Web API, complete with interactive Play/Pause controls and mini player.
- 💻 **GitHub Project Showcase:** Featured spotlight card highlighting active open-source builds (e.g. [StayActive](https://github.com/uga961/StayActive)).
- 🚀 **Smooth Scroll Floating Dock:** Floating M3 action buttons on the bottom-right to jump to the top or bottom of long reads with intelligent scroll detection.
- 📋 **1-Click Code Copy:** Syntax-highlighted code snippets with clean DOM text extraction (no `[object Object]` artifacts).
- 🌐 **Comprehensive SEO & Structured Data:**
  - Google Schema.org JSON-LD (`WebSite` + `Person` on root, `BlogPosting` on all article pages).
  - OpenGraph & Twitter Cards with 1200x630 profile and article thumbnails.
  - Native Next.js 15 `sitemap.xml` and `robots.txt` generation.
  - RSS 2.0 feed available at `/feed.xml`.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/uga961/blog.git
cd blog

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Writing a New Post

1. Copy `template.md` into the `posts/` folder:
   ```bash
   cp template.md posts/my-new-article.md
   ```
2. Update the frontmatter metadata:
   ```yaml
   ---
   title: "Your Post Title Here"
   slug: "my-new-article"
   date: "2026-10-23"
   excerpt: "A concise 1-2 sentence preview hook."
   tags: ["Python", "Engineering"]
   coverImage: "https://i.imgur.com/example.jpg"
   author: "Ugandhar Vaddi"
   published: true
   ---
   ```
3. Write your article below the frontmatter using GitHub-Flavored Markdown.
4. Save the file — the dev server and production SSG pick it up instantly.

---

## Project Structure

```
├── posts/                      # Your published Markdown articles
│   ├── debloat-android-tv-adb-guide.md
│   ├── python-data-visualization-matplotlib-seaborn-guide.md
│   ├── rbi-500-rupee-note-quality-control.md
│   └── why-i-built-stayactive.md
├── template.md                 # Starter template for new articles
├── public/                     # Static assets (favicons, logos, profile pictures)
│   ├── favicon.ico
│   ├── Logo.png
│   ├── apple-icon.png
│   └── ugandhar-profile.jpg
├── scripts/
│   └── get-spotify-token.mjs   # Helper to generate Spotify OAuth Refresh Tokens
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx            # Homepage with Hero, Featured Preview & Article Grid
│   │   ├── posts/[slug]/       # Full article reader, TOC, share buttons & related posts
│   │   ├── api/spotify/        # Live music endpoint (Last.fm + Spotify API)
│   │   ├── feed.xml/           # Dynamic RSS 2.0 feed
│   │   ├── sitemap.ts          # Native dynamic sitemap generator
│   │   ├── robots.ts           # Native robots.txt configuration
│   │   └── layout.tsx          # Root layout with JSON-LD, fonts & analytics
│   ├── components/
│   │   ├── blog/               # ArticleCard, ArticleList, MarkdownRenderer, ActivityShowcase
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Badge, Button, ThemeToggle, ScrollNavigation
│   └── lib/
│       ├── posts.ts            # Markdown parser & post querying engine
│       ├── music.ts            # Dual-engine live playback resolver
│       ├── spotify.ts          # Spotify Web API client
│       ├── markdown.ts         # TOC extraction & reading-time estimation
│       └── config.ts           # Site configuration
├── tests/                      # Vitest unit test suite (15 tests)
└── .env                        # Local environment variables
```

---

## Configuration (`.env`)

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production website URL (e.g. `https://blog.ugandhar.in`) |
| `NEXT_PUBLIC_SITE_NAME` | Author display name |
| `NEXT_PUBLIC_SITE_TAGLINE` | Header subtitle / role summary |
| `NEXT_PUBLIC_SITE_BIO` | Bio displayed in author cards |
| `NEXT_PUBLIC_SITE_GITHUB` | GitHub profile link |
| `NEXT_PUBLIC_SITE_YOUTUBE` | YouTube channel link |
| `NEXT_PUBLIC_SITE_LINKEDIN` | LinkedIn profile link |
| `NEXT_PUBLIC_SITE_REDDIT` | Reddit profile link |
| `LASTFM_USERNAME` | *(Optional)* Last.fm username for 100% free live Spotify tracking |
| `LASTFM_API_KEY` | *(Optional)* Free Last.fm API Key from [last.fm/api/account/create](https://www.last.fm/api/account/create) |
| `SPOTIFY_CLIENT_ID` | *(Optional)* Spotify Developer App Client ID |
| `SPOTIFY_CLIENT_SECRET` | *(Optional)* Spotify Developer App Client Secret |
| `SPOTIFY_REFRESH_TOKEN` | *(Optional)* Spotify OAuth Refresh Token (requires Spotify Premium) |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `http://localhost:3000` |
| `npm run build` | Compile optimized production build and prerender static pages |
| `npm start` | Run production server |
| `npm test` | Run unit test suite (15 Vitest tests) |
| `npm run lint` | Run Next.js ESLint checks |
| `npm run spotify:token` | CLI helper to generate a Spotify OAuth refresh token |

---

## Deployment

### Vercel (Recommended)
This repository is pre-configured for zero-config deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add your production environment variables (`NEXT_PUBLIC_SITE_URL`, `LASTFM_*`, etc.) under **Settings &rarr; Environment Variables**.
4. Click **Deploy**.

For custom domains (e.g., via GoDaddy), add a CNAME record pointing `blog` (or your subdomain) to `cname.vercel-dns.com`.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, SSG, Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Material 3 tokens
- **Typography:** Geist Sans, Geist Mono, Newsreader
- **Markdown Parsing:** `gray-matter`, `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-slug`
- **Analytics:** `@vercel/analytics`
- **Testing:** [Vitest](https://vitest.dev/) (15/15 unit tests)

---

## License

[MIT](LICENSE) © [Ugandhar Vaddi](https://github.com/uga961)
