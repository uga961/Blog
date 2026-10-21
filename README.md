# Personal Blogging Platform

A production-ready personal blogging platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL + Prisma ORM**.

Designed with a typography-led editorial aesthetic featuring warm ivory backgrounds, charcoal typography, fine 1px borders, and restrained emerald green accents.

---

## Table of Contents

1. [Features](#features)
2. [Design System & UI](#design-system--ui)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Project Structure](#project-structure)
5. [Local Development Setup](#local-development-setup)
6. [Administrator Authentication & Seeding](#administrator-authentication--seeding)
7. [Git-Based Markdown Publishing Workflow](#git-based-markdown-publishing-workflow)
8. [Automated Testing](#automated-testing)
9. [Production Deployment with Docker](#production-deployment-with-docker)
10. [Domain & DNS Setup (`blog.xyz.in`)](#domain--dns-setup-blogxyzin)
11. [Nginx Reverse Proxy & HTTPS (Let's Encrypt)](#nginx-reverse-proxy--https-lets-encrypt)
12. [Image Uploads (Local vs S3/R2 Storage)](#image-uploads-local-vs-s3r2-storage)
13. [Backups & Disaster Recovery](#backups--disaster-recovery)
14. [Health Check & Troubleshooting](#health-check--troubleshooting)

---

## Features

- **Editorial Reading Experience**:
  - Distraction-free reading column (~720px) typeset in *Newsreader* serif and *Geist* sans-serif.
  - Thin scroll-triggered reading progress bar fixed at the top of the viewport.
  - Dynamic Table of Contents for H2/H3 headings.
  - GitHub Flavored Markdown (GFM) with tables, blockquotes, task lists, and responsive images.
  - Syntax-highlighted code blocks with language labels and a 1-click **Copy** button with tactile feedback.
  - Instant client-side search across titles, excerpts, and article content.
  - Interactive tag filtering and pagination.
  - Native Dark/Light mode toggle with system preference detection and localStorage persistence.
  - Social sharing links (X/Twitter, LinkedIn, Copy Link).
- **Secure Server-Side Admin Management**:
  - Secure login portal at `/admin` protected by rate-limiting (5 failed attempts trigger a 15-minute lockout).
  - Password hashing with **bcrypt** (12 salt rounds).
  - HttpOnly, SameSite, signed JWT session cookies using **jose**.
  - Server-side authorization check enforcing access control on all administrative routes, APIs, and mutations.
  - No public registration; zero client-side credential checks.
- **Content Editor & Publishing Engine**:
  - Markdown editor with **Write**, **Preview**, and **Split** modes.
  - Markdown formatting toolbar (Bold, Italic, Headings, Quotes, Lists, Tables, Code).
  - Real-time slug auto-generation with collision detection (`slug`, `slug-2`, etc.).
  - Drafts vs. Published vs. Scheduled states.
  - **Strict Gatekeeping**: Unpublished drafts and future-scheduled articles are never leaked through public API routes or rendered pages.
  - Unsaved-changes warning (`beforeunload` protection).
- **Image Upload Pipeline**:
  - Upload modal directly within the editor.
  - Server-side MIME validation (JPEG, PNG, WebP, GIF, SVG) and magic bytes header verification.
  - Unpredictable SHA-256 hash-based filename generation.
  - Supports **Local Storage** (`public/uploads`) or **S3-compatible Object Storage** (AWS S3, Cloudflare R2, MinIO, Wasabi).
- **Git-Based Synchronization**:
  - Optional workflow allowing authoring articles in `content/posts/*.md` with YAML frontmatter.
  - Synchronize via `npm run sync:content`.
- **SEO & Feeds**:
  - Dynamic OpenGraph and Twitter cards for every post with cover image integration.
  - Dynamic RSS 2.0 feed at `/feed.xml`.
  - Dynamic XML sitemap at `/sitemap.xml`.
  - `robots.txt` disallowing `/admin` indexing.

---

## Design System & UI

Inspired by minimalist editorial publications:

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#faf9f5` (Warm Ivory) | `#0e1014` (Deep Obsidian) | Main viewport canvas |
| **Surface/Card** | `#ffffff` (Crisp White) | `#16191f` (Dark Charcoal) | Cards, modals, toolbars |
| **Foreground** | `#181b20` (Ink Charcoal) | `#f3f4f6` (Off-white) | Primary headlines & body |
| **Muted** | `#6b7280` | `#9ca3af` | Dates, reading time, subtitles |
| **Borders** | `#e5e3dc` (1px subtle) | `#242730` (1px subtle) | Section dividers, containers |
| **Accent** | `#059669` (Forest Emerald) | `#10b981` (Bright Emerald) | Links, buttons, progress bar |

---

## Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router, Standalone build output)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with `@tailwindcss/typography`
- **Icons**: Lucide React
- **Database**: PostgreSQL 16
- **ORM**: Prisma ORM with migrations
- **Authentication**: `jose` JWT cookies + `bcryptjs`
- **Markdown**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-slug`
- **Validation**: Zod
- **Testing**: Vitest (Unit & Business logic tests)
- **DevOps**: Docker, Docker Compose, Nginx

---

## Project Structure

```text
├── content/
│   └── posts/                  # Sample markdown posts for Git-based sync
├── nginx/
│   └── nginx.conf              # Production Nginx reverse proxy configuration
├── prisma/
│   ├── schema.prisma           # Prisma PostgreSQL schema
│   ├── seed.ts                 # Database seed script (creates admin + sample posts)
│   └── migrations/             # SQL schema migrations
├── public/
│   └── uploads/                # Local uploaded images storage
├── scripts/
│   ├── backup.sh               # Database & uploads automated backup script
│   ├── restore.sh              # Database restore script
│   └── sync-content.ts         # Git Markdown sync command
├── src/
│   ├── app/
│   │   ├── globals.css         # Design tokens & syntax highlight theme
│   │   ├── layout.tsx          # Root layout & font definition
│   │   ├── page.tsx            # Public homepage
│   │   ├── feed.xml/route.ts   # Dynamic RSS 2.0 feed
│   │   ├── sitemap.xml/route.ts# Dynamic sitemap
│   │   ├── robots.txt/route.ts # Dynamic robots.txt
│   │   ├── posts/[slug]/       # Individual article reader & 404 handler
│   │   ├── admin/
│   │   │   ├── page.tsx        # Admin login page
│   │   │   ├── dashboard/      # Content management dashboard
│   │   │   └── editor/         # Markdown editor (Create & Edit)
│   │   └── api/
│   │       ├── auth/           # Login, logout, session check
│   │       ├── admin/          # Posts CRUD, image uploads
│   │       ├── posts/          # Public filtered posts endpoint
│   │       └── health/         # Healthcheck endpoint
│   ├── components/
│   │   ├── blog/               # ArticleCard, MarkdownRenderer, ReadingProgressBar, etc.
│   │   ├── admin/              # PostForm, ImageUploader, DeleteConfirmModal
│   │   ├── layout/             # Header, Footer, AdminHeader
│   │   └── ui/                 # Button, Input, Badge, Modal, Toast, ThemeToggle
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       ├── auth.ts             # Password hashing & auth verification
│       ├── session.ts          # Encrypted JWT session cookies
│       ├── rate-limit.ts       # Login rate limiter (in-memory + DB tracking)
│       ├── storage.ts          # Local & S3-compatible image upload engine
│       ├── slug.ts             # Slug generator & collision resolver
│       └── markdown.ts         # Reading time calculation & TOC generator
├── tests/                      # Automated Vitest test suite
├── Dockerfile                  # Multi-stage production container build
├── docker-compose.yml          # Web + PostgreSQL stack definition
└── package.json
```

---

## Local Development Setup

### 1. Prerequisites
- Node.js 20+ or 22+
- npm 10+
- (Optional) Docker or local PostgreSQL instance

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/personal-blog.git
cd personal-blog
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Review the values in `.env`:
- `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/blog_db?schema=public`)
- `SESSION_SECRET`: 32+ character random string for signing session cookies
- `ADMIN_EMAIL`: Initial administrator email (e.g. `admin@xyz.in`)
- `ADMIN_PASSWORD`: Administrator password (e.g. `AdminPassword123!`)
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` for local dev

### 4. Database Setup & Seeding
If you have a local PostgreSQL instance running:

```bash
# Push schema migrations
npm run prisma:deploy

# Initialize admin account and sample articles
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Public Homepage: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin`
- RSS Feed: `http://localhost:3000/feed.xml`
- Sitemap: `http://localhost:3000/sitemap.xml`
- Healthcheck: `http://localhost:3000/api/health`

---

## Administrator Authentication & Seeding

- Navigate to `/admin`.
- Enter the credentials defined in your `.env` (default: `admin@xyz.in` / `AdminPassword123!`).
- Once authenticated, you will be redirected to `/admin/dashboard`.
- To re-initialize or update the admin credentials at any time, run:

```bash
npm run prisma:seed
```

---

## Git-Based Markdown Publishing Workflow

In addition to the Web Dashboard, you can manage content directly via Git:

1. Create a markdown file inside `content/posts/` (e.g., `content/posts/my-new-post.md`).
2. Add YAML frontmatter at the top:

```markdown
---
title: "Zero-Trust Architecture in Practice"
slug: "zero-trust-architecture-in-practice"
date: "2026-10-21T10:00:00.000Z"
excerpt: "A practical guide to securing internal network services."
tags: ["security", "networking", "cloud"]
status: "PUBLISHED"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
---

## Introduction

Your markdown content starts here...
```

3. Run the synchronization command:

```bash
npm run sync:content
```

The script validates frontmatter with Zod, parses reading time, ensures slug uniqueness, and upserts the post into PostgreSQL.

---

## Automated Testing

Run the automated test suite with Vitest:

```bash
npm test
```

The test suite covers:
- Slug normalization, diacritics removal, and collision handling (`tests/slug.test.ts`)
- Reading time estimation, TOC heading extraction, and excerpt generation (`tests/markdown.test.ts`)
- Password hashing with bcrypt, password verification, and JWT session token issuance (`tests/auth.test.ts`)
- Image upload MIME validation, size enforcement, and safe hash-based naming (`tests/storage.test.ts`)
- Strict publication gating: verifying drafts and future-scheduled posts are hidden from public queries (`tests/publication-rules.test.ts`)

---

## Production Deployment with Docker

The application includes a production multi-stage `Dockerfile` and `docker-compose.yml` that provisions both the **Next.js application** and a **PostgreSQL 16** database container with persistent volumes.

### 1. Configure Production `.env`
On your Linux VPS:

```bash
git clone https://github.com/your-username/personal-blog.git /opt/personal-blog
cd /opt/personal-blog
cp .env.example .env
nano .env
```

Ensure you change:
- `SESSION_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
- `ADMIN_PASSWORD`: A strong administrator password
- `NEXT_PUBLIC_SITE_URL`: `https://blog.xyz.in` (replace with your actual domain)
- `POSTGRES_PASSWORD`: A strong PostgreSQL database password

### 2. Start Services with Docker Compose

```bash
docker compose up -d --build
```

### 3. Apply Migrations & Seed Admin User

```bash
# Apply database migrations
docker compose exec web npx prisma migrate deploy

# Initialize the admin account and sample articles
docker compose exec web npx prisma db seed
```

The app will be running on port `3000`.

---

## Domain & DNS Setup (`blog.xyz.in`)

In your domain registrar's DNS management console (e.g. Cloudflare, Namecheap, GoDaddy):

1. Add an **A Record**:
   - **Type**: `A`
   - **Name / Host**: `blog` (or `@` if using root domain)
   - **Value / IPv4**: `<YOUR_SERVER_IP>`
   - **TTL**: Auto or 300 seconds

2. Verify DNS propagation:

```bash
dig +short blog.xyz.in
# or
nslookup blog.xyz.in
```

---

## Nginx Reverse Proxy & HTTPS (Let's Encrypt)

### 1. Install Nginx and Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Configure Nginx
Copy the provided Nginx configuration to your server:

```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/blog.xyz.in
```

Update `/etc/nginx/sites-available/blog.xyz.in` replacing `blog.xyz.in` with your actual domain name.

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/blog.xyz.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Obtain Free Let's Encrypt SSL Certificate

```bash
sudo certbot --nginx -d blog.xyz.in
```

Certbot will configure SSL renewal automatically via systemd timer.

---

## Image Uploads (Local vs S3/R2 Storage)

### Local Storage (Default)
By default (`STORAGE_PROVIDER=local`), uploaded files are stored in `public/uploads/` and served at `/uploads/<filename>`. In Docker Compose, this directory is mounted to the persistent volume `uploads_data`.

### S3 / Cloudflare R2 / MinIO Storage
To use an S3-compatible bucket in production, update `.env`:

```env
STORAGE_PROVIDER="s3"
S3_BUCKET="my-blog-assets"
S3_REGION="auto" # or us-east-1
S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com" # Required for R2 / MinIO
S3_ACCESS_KEY_ID="your-access-key-id"
S3_SECRET_ACCESS_KEY="your-secret-access-key"
S3_PUBLIC_URL="https://assets.xyz.in" # Public CDN / custom domain for bucket
```

---

## Backups & Disaster Recovery

### Automated Backup Script
Run the automated backup script to dump the PostgreSQL database and compress uploaded images:

```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

Backups are saved to `./backups/`:
- `db_YYYYMMDD_HHMMSS.sql.gz` (PostgreSQL dump)
- `uploads_YYYYMMDD_HHMMSS.tar.gz` (Media assets)

### Automated Cron Job
To run daily backups automatically at 2:00 AM, add a cron entry (`crontab -e`):

```cron
0 2 * * * cd /opt/personal-blog && ./scripts/backup.sh >> /var/log/blog-backup.log 2>&1
```

### Restore Script

```bash
chmod +x scripts/restore.sh
./scripts/restore.sh ./backups/db_20261021_120000.sql.gz ./backups/uploads_20261021_120000.tar.gz
```

---

## Health Check & Troubleshooting

### Health Check Endpoint
Query `/api/health` to verify database connectivity and uptime:

```bash
curl -i http://localhost:3000/api/health
```

Expected response (`200 OK`):

```json
{
  "status": "healthy",
  "uptime": 1284.5,
  "timestamp": "2026-10-21T14:40:00.000Z",
  "database": "connected"
}
```

### Common Issues & Solutions

1. **"Can't reach database server at localhost:5432"**:
   - Ensure PostgreSQL is running (`sudo systemctl status postgresql` or `docker compose ps`).
   - Check that `DATABASE_URL` matches the credentials in `.env`.

2. **Rate limited on login**:
   - If locked out by the rate limiter, wait 15 minutes or execute:
   ```bash
   # Reset login attempts table
   docker compose exec web npx prisma db execute --stdin <<< "DELETE FROM login_attempts;"
   ```

3. **Images not displaying after upload**:
   - Ensure `public/uploads` has write permissions (`chmod 775 public/uploads`).
   - If using S3/R2, ensure your bucket's CORS and public read policies are properly configured.

---

## License

MIT © Alex Johnson
