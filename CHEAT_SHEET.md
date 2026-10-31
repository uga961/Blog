# 🚀 Ugandhar Vaddi Thoughts — Master Cheat Sheet & Workflow Guide

A step-by-step developer cheat sheet for managing, writing, updating, indexing, and deploying articles on [thoughts.ugandhar.in](https://thoughts.ugandhar.in).

---

## ⚡ 1. Quick Command Reference

| Action | Command | What It Does |
| :--- | :--- | :--- |
| **Start Local Server** | `npm run dev` | Runs local dev server at `http://localhost:3000` with hot-reload |
| **Audit & Update Dates** | `npm run update-dates` | Reads filesystem and git timestamps, syncing `lastUpdated` for all articles |
| **Submit to Search Engines** | `npm run indexnow` | Instantly notifies Microsoft Bing and Copilot crawlers via IndexNow protocol |
| **Run Unit Tests** | `npm test` | Runs the 20 automated Vitest unit tests (slug, date, markdown, posts) |
| **Lint & Typecheck** | `npm run lint` | Runs Next.js ESLint and TypeScript validation |
| **Verify Production Build** | `npm run build` | Compiles an optimized production build and generates all 16 static routes |
| **Start Production Server** | `npm run start` | Serves the production build locally |
| **Generate Spotify Token** | `npm run spotify:token` | Interactive helper to generate Spotify OAuth refresh tokens |

---

## ✍️ 2. Step-by-Step Guide: Publishing a New Post

### Step 1: Copy the Template
Copy the starter template into the `posts/` folder:
```bash
cp template.md posts/your-article-slug.md
```
*(Tip: name the file with lowercase words separated by dashes, e.g. `system-design-notes.md`)*

### Step 2: Edit the Frontmatter
Open `posts/your-article-slug.md` and update the top frontmatter block:

```yaml
---
title: "Your Post Title Here"
slug: "your-article-slug"
date: "2026-10-31"
lastUpdated: ""
excerpt: "A concise 1-2 sentence preview or hook describing what this article covers."
tags: ["Technology", "Engineering"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
author: "Ugandhar"
published: true
---
```

**Key Fields Explained:**
- **`title`**: The main title displayed on the homepage and article header.
- **`slug`**: The URL path: `thoughts.ugandhar.in/posts/your-article-slug`. (If left blank, it auto-generates from the filename or title).
- **`date`**: Publication date in `YYYY-MM-DD` format.
- **`lastUpdated`**: Can be left blank (`""`). The system automatically detects file modification timestamps!
- **`excerpt`**: Used for search engine meta descriptions, OpenGraph social previews, and homepage cards.
- **`tags`**: List of tags. The first tag becomes the primary badge category.
- **`coverImage`**: URL to an image. For GitHub-hosted images:
  `https://raw.githubusercontent.com/uga961/repo-name/main/path/image.png`
- **`published`**: Set to `true` to go live, or `false` to keep as a private local draft.

### Step 3: Write Your Article
Write your article using standard GitHub Flavored Markdown:
- Subheadings: `## Section Heading`, `### Subsection`
- Code blocks: Include language tag for syntax highlighting (` ```python `, ` ```typescript `, ` ```bash `)
- Tables: Standard markdown tables with alignment (`| Col 1 | Col 2 |`)
- Blockquotes: `> A reflective quote or key takeaway`
- Images: `![Description of diagram](https://...)`

### Step 4: Preview Locally
Start the development server and verify formatting:
```bash
npm run dev
```
Open `http://localhost:3000/posts/your-article-slug` in your browser.

### Step 5: (Optional) Auto-Sync Modification Dates
To ensure all timestamps are current:
```bash
npm run update-dates
```

### Step 6: Commit and Push to GitHub
Commit using portfolio conventional commit style:
```bash
git add posts/your-article-slug.md
git commit -m "feat(blog): publish your article title here"
git push origin main
```
*Vercel will automatically build and deploy your changes to `https://thoughts.ugandhar.in` within 45 seconds.*

### Step 7: Push Instantly to Search Engines (IndexNow)
Notify search engines (Bing, Copilot, Yandex) to index your new article immediately without waiting for standard crawl cycles:
```bash
npm run indexnow
```

---

## 🕒 3. How the Automatic Date & Time System Works

You do **NOT** have to update dates manually!

1. **Automatic Runtime Detection**:
   When reading a post, if `lastUpdated` in the frontmatter is empty or omitted, the system automatically inspects:
   - The file's exact modification timestamp on disk (`fs.statSync().mtime`).
   - The last git commit date for that file (`git log -1 --format="%ai"`).
2. **Display Format**:
   - `date`: Displayed as the official published date (e.g. `October 31, 2026`).
   - `lastUpdated`: Displayed as a subtle badge `Updated Oct 31, 2026` if it differs from the publication date, and detailed in the footer metadata as `Last updated October 31, 2026`.
3. **The Audit Script (`npm run update-dates`)**:
   Runs [`scripts/update-post-dates.mjs`](file:///home/uga961/Projects/Blog/scripts/update-post-dates.mjs) which scans every file in `/posts`, checks timestamps, and reports any out-of-sync frontmatter.

---

## 🌐 4. Search Engine Indexing & SEO Checklist

### Google Search Console
- **Meta Verification**: Automatically injected into the `<head>` of every page:
  `d6qC6JXOnKpcVtH15DHGM1LslxfSPMTZd2mavDkuMY8`
- **Sitemap**: Available at `https://thoughts.ugandhar.in/sitemap.xml`.
  Submit `https://thoughts.ugandhar.in/sitemap.xml` in your Google Search Console dashboard under **Sitemaps**.
- **Robots.txt**: Live at `https://thoughts.ugandhar.in/robots.txt` allowing all legitimate crawlers.
- **Rich Structured Data**: Every article automatically includes JSON-LD `BlogPosting`, `BreadcrumbList`, and `Person` schema markup.

### Microsoft Bing & Copilot (IndexNow)
- **Protocol**: IndexNow allows instant, push-based URL submission.
- **Key File**: Hosted at `https://thoughts.ugandhar.in/2f8745c1a89b4f99a071de8463990b76.txt`.
- **Command**: Run `npm run indexnow` anytime you publish or update articles.

---

## 🎵 5. Spotify & Last.fm Telemetry

The live vinyl player in the **Currently Crafting & Grooving** section (`INDEX 003`) pulls real-time music telemetry:

- **Source Priority**:
  1. **Last.fm Real-Time Scrobbles**: Tracks whatever you are currently playing on Spotify, desktop, or mobile via the Last.fm username `uga961`.
  2. **Spotify API**: Fallback directly to the official Spotify Now Playing API.
  3. **Curated Showcase**: Fallback to your configured playlist if no track is currently active.
- **API Endpoint**: Handled server-side at `/api/spotify` so your API secrets (`SPOTIFY_CLIENT_SECRET`, `LASTFM_API_KEY`) are never exposed to the client.

---

## ☁️ 6. Vercel Environment Variables Reference

Ensure these are added in your Vercel Project Dashboard (**Settings** → **Environment Variables**):

```env
SPOTIFY_CLIENT_ID="cf52a672b46643218d7904013ad57a70"
SPOTIFY_CLIENT_SECRET="62eb9bdf24764fd493efb2f0faa0bc2c"
SPOTIFY_REFRESH_TOKEN="AQBcD9FVcqDhOnsihN4wllgSOgfu1KHOECri8D4Lhs4W_Yq8hD-zNRqAqG_yjkpzAlTwOND45KnU6a1TGeHD4Sd5maj-aOmvoLXfzs8RMpOj556t23j5bhRBuGLBF1wZr3c"
LASTFM_USERNAME="uga961"
LASTFM_API_KEY="84e7bb3a7e5455a00069503881b63e5e"
INDEXNOW_KEY="2f8745c1a89b4f99a071de8463990b76"
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="d6qC6JXOnKpcVtH15DHGM1LslxfSPMTZd2mavDkuMY8"
```

---

## 🎨 7. Design System Guidelines

- **Container Width**: `w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` across Header, Main, and Footer.
- **Reading Width**: `w-full max-w-3xl lg:max-w-[860px] mx-auto` for ergonomic line lengths.
- **Live Indicators**:
  - Green dot: Active publishing count (`bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`).
  - Amber dot: Featured article (`bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]`).
  - Blue dot: Active engineering project (`bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse`).
  - Spotify green: Live audio telemetry (`bg-[#1DB954] shadow-[0_0_8px_rgba(29,185,84,0.6)] animate-pulse`).
