import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { generateSlug } from "./slug";

export interface Post {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  date: string;
  lastUpdated: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  author: string;
  readingTime: number;
  published: boolean;
}

export type PostSummary = Omit<Post, "content">;

const POSTS_DIRECTORY = path.join(process.cwd(), "posts");

/**
 * Ensures the posts directory exists.
 */
function ensurePostsDirectory(): string {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
  }
  return POSTS_DIRECTORY;
}

/**
 * Extracts a concise excerpt from markdown text if none is provided in frontmatter.
 */
function extractFallbackExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
    .replace(/^#+\s+(.*)$/gm, "") // headers
    .replace(/>\s+(.*)$/gm, "$1") // blockquotes
    .replace(/[*_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
}

/**
 * Normalizes date to YYYY-MM-DD string.
 */
function normalizeDate(rawDate: unknown): string {
  if (!rawDate) return new Date().toISOString().slice(0, 10);
  try {
    const d = new Date(rawDate as string | number | Date);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
  } catch {}
  return String(rawDate).slice(0, 10);
}

/**
 * Fetches all published markdown posts sorted by date (newest first).
 */
export function getAllPosts(includeDrafts: boolean = false): Post[] {
  const dir = ensurePostsDirectory();
  const fileNames = fs.readdirSync(dir);

  const posts: Post[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) continue;

    const filePath = path.join(dir, fileName);
    let stats: fs.Stats | null = null;
    try {
      stats = fs.statSync(filePath);
    } catch {}

    const fileContents = fs.readFileSync(filePath, "utf-8");

    try {
      const { data, content } = matter(fileContents);

      // Check publication status
      const published = data.published !== false;
      if (!includeDrafts && !published) continue;

      const fileSlug = fileName.replace(/\.md$/, "");
      const slug = data.slug ? generateSlug(String(data.slug)) : fileSlug;
      const title = data.title ? String(data.title) : fileSlug.replace(/-/g, " ");
      const seoTitle = data.seoTitle ? String(data.seoTitle).trim() : undefined;
      const date = normalizeDate(data.date);

      // Automatic last modified time detection:
      // If specified in frontmatter, use that; otherwise use filesystem stats mtime
      const autoMtime = stats ? stats.mtime.toISOString().slice(0, 10) : date;
      const lastUpdated = data.lastUpdated ? normalizeDate(data.lastUpdated) : autoMtime;

      const excerpt = data.excerpt ? String(data.excerpt).trim() : extractFallbackExcerpt(content);
      const tags = Array.isArray(data.tags)
        ? data.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : [];
      const coverImage = data.coverImage ? String(data.coverImage).trim() : undefined;
      const author = data.author ? String(data.author).trim() : "Ugandhar Vaddi";

      const rt = readingTime(content);
      const minutes = Math.max(1, Math.ceil(rt.minutes));

      posts.push({
        id: fileSlug,
        slug,
        title,
        seoTitle,
        date,
        lastUpdated,
        excerpt,
        content: content.trim(),
        tags,
        coverImage,
        author,
        readingTime: minutes,
        published,
      });
    } catch (err) {
      console.warn(`Failed to parse markdown file ${fileName}:`, err);
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Fetches a single post by its URL slug or filename id.
 */
export function getPostBySlug(slug: string, includeDrafts: boolean = false): Post | null {
  const allPosts = getAllPosts(includeDrafts);
  return allPosts.find((p) => p.slug === slug || p.id === slug) || null;
}

/**
 * Gathers all unique tags with post counts.
 */
export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts(false);
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Retrieves the latest / featured article for the hero preview.
 */
export function getFeaturedPost(): Post | null {
  const posts = getAllPosts(false);
  return posts[0] || null;
}
