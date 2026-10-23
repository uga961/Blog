import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { generateSlug } from "./slug";

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
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
 * Fetches all published markdown posts sorted by date (newest first).
 */
export function getAllPosts(includeDrafts: boolean = false): Post[] {
  const dir = ensurePostsDirectory();
  const fileNames = fs.readdirSync(dir);

  const posts: Post[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) continue;

    const filePath = path.join(dir, fileName);
    const fileContents = fs.readFileSync(filePath, "utf-8");

    try {
      const { data, content } = matter(fileContents);

      // Check publication status
      const published = data.published !== false;
      if (!includeDrafts && !published) continue;

      const fileSlug = fileName.replace(/\.md$/, "");
      const slug = data.slug ? generateSlug(data.slug) : fileSlug;
      const title = data.title || fileSlug.replace(/-/g, " ");
      const date = data.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      const excerpt = data.excerpt || extractFallbackExcerpt(content);
      const tags = Array.isArray(data.tags)
        ? data.tags.map((t: string) => String(t).trim()).filter(Boolean)
        : [];
      const coverImage = data.coverImage || undefined;
      const author = data.author || "Ugandhar Vaddi";

      const rt = readingTime(content);
      const minutes = Math.max(1, Math.ceil(rt.minutes));

      posts.push({
        id: fileSlug,
        slug,
        title,
        date,
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
 * Fetches a single post by its URL slug.
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
 * Retrieves the latest / featured article for the hero sneak peek.
 */
export function getFeaturedPost(): Post | null {
  const posts = getAllPosts(false);
  return posts[0] || null;
}
