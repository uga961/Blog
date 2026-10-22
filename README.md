# Personal Blog

A clean, fast, file-based personal blog built with **Next.js 15**, **Tailwind CSS**, and **Material 3** design tokens. No database, no CMS — just Markdown files.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Writing a New Post

1. Copy `template.md` into the `posts/` directory
2. Rename it to your desired URL slug (e.g. `my-first-post.md`)
3. Fill in the frontmatter and write your article in Markdown
4. Save — the dev server picks it up instantly

### Frontmatter Reference

```yaml
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "A short summary shown on the homepage card."
tags: ["web", "engineering"]
coverImage: "/images/cover.jpg"       # optional
author: "Your Name"                    # optional, defaults to site name
published: true                        # set to false to hide as draft
---
```

## Project Structure

```
├── posts/              # Your Markdown articles live here
│   └── my-post.md
├── template.md         # Starter template for new articles
├── public/             # Static assets (images, favicons, etc.)
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── page.tsx              # Homepage
│   │   ├── posts/[slug]/page.tsx # Article reader
│   │   ├── feed.xml/route.ts     # RSS feed
│   │   ├── sitemap.xml/route.ts  # Sitemap
│   │   └── robots.txt/route.ts   # Robots.txt
│   ├── components/
│   │   ├── blog/       # Article cards, list, markdown renderer, etc.
│   │   ├── layout/     # Header, Footer
│   │   └── ui/         # Badge, Button, ThemeToggle
│   └── lib/
│       ├── posts.ts    # File-based post engine (reads /posts/*.md)
│       ├── markdown.ts # TOC extraction, reading time, excerpts
│       ├── config.ts   # Site configuration (reads env vars)
│       └── slug.ts     # URL slug generation
├── tests/              # Vitest unit tests
└── .env                # Local environment config (not committed)
```

## Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production domain URL |
| `NEXT_PUBLIC_SITE_NAME` | Your display name |
| `NEXT_PUBLIC_SITE_TAGLINE` | Short tagline under your name |
| `NEXT_PUBLIC_SITE_BIO` | Brief bio paragraph |
| `NEXT_PUBLIC_SITE_GITHUB` | GitHub profile URL |
| `NEXT_PUBLIC_SITE_YOUTUBE` | Youtube Channel URL |
| `NEXT_PUBLIC_SITE_LINKEDIN` | LinkedIn profile URL |
| `NEXT_PUBLIC_SITE_REDDIT` | Reddit profile URL |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Deployment

This blog works out of the box with [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import the project on Vercel
3. Set your environment variables
4. Deploy

For custom domains (e.g. GoDaddy), point your domain's DNS to Vercel after deploying.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Material 3 design tokens
- **Typography:** Geist Sans, Geist Mono, Newsreader (serif)
- **Markdown:** react-markdown, remark-gfm, rehype-highlight, rehype-slug
- **Testing:** Vitest

## License

MIT
