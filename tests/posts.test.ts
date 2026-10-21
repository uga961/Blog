import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllPosts, getPostBySlug, getAllTags } from "@/lib/posts";

describe("Markdown Posts System", () => {
  it("root template.md exists and contains valid frontmatter", () => {
    const templatePath = path.join(process.cwd(), "template.md");
    expect(fs.existsSync(templatePath)).toBe(true);

    const raw = fs.readFileSync(templatePath, "utf-8");
    const { data, content } = matter(raw);

    expect(data.title).toBeDefined();
    expect(data.slug).toBeDefined();
    expect(data.date).toBeDefined();
    expect(data.excerpt).toBeDefined();
    expect(Array.isArray(data.tags)).toBe(true);
    expect(content.length).toBeGreaterThan(50);
  });

  it("reads all markdown files from /posts and parses metadata", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);

    const first = posts[0];
    expect(first.slug).toBeDefined();
    expect(first.title).toBeDefined();
    expect(first.date).toBeDefined();
    expect(first.readingTime).toBeGreaterThanOrEqual(1);
    expect(first.content.length).toBeGreaterThan(0);
  });

  it("finds a specific post by slug", () => {
    const post = getPostBySlug("building-resilient-distributed-systems");
    expect(post).not.toBeNull();
    expect(post?.title).toContain("Distributed Systems");
  });

  it("gathers unique tags with correct post counts", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0].name).toBeDefined();
    expect(tags[0].count).toBeGreaterThanOrEqual(1);
  });

  it("returns null for non-existent post slug", () => {
    const post = getPostBySlug("non-existent-article-slug-123");
    expect(post).toBeNull();
  });
});
