import { describe, it, expect } from "vitest";

interface PostCheckInput {
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: Date | null;
}

function isPostPubliclyVisible(post: PostCheckInput, now: Date = new Date()): boolean {
  if (post.status !== "PUBLISHED") return false;
  if (!post.publishedAt) return false;
  return post.publishedAt <= now;
}

describe("Publication & Scheduling Business Rules", () => {
  const now = new Date("2026-10-21T12:00:00Z");

  it("permits published posts with past publication timestamps", () => {
    const post: PostCheckInput = {
      status: "PUBLISHED",
      publishedAt: new Date("2026-10-20T10:00:00Z"),
    };
    expect(isPostPubliclyVisible(post, now)).toBe(true);
  });

  it("permits published posts published at current timestamp", () => {
    const post: PostCheckInput = {
      status: "PUBLISHED",
      publishedAt: new Date("2026-10-21T12:00:00Z"),
    };
    expect(isPostPubliclyVisible(post, now)).toBe(true);
  });

  it("strictly hides drafts regardless of publishedAt value", () => {
    const post: PostCheckInput = {
      status: "DRAFT",
      publishedAt: new Date("2026-10-20T10:00:00Z"),
    };
    expect(isPostPubliclyVisible(post, now)).toBe(false);
  });

  it("strictly hides scheduled posts whose status is SCHEDULED", () => {
    const post: PostCheckInput = {
      status: "SCHEDULED",
      publishedAt: new Date("2026-10-25T10:00:00Z"),
    };
    expect(isPostPubliclyVisible(post, now)).toBe(false);
  });

  it("strictly hides published posts whose publication time is in the future", () => {
    const futurePost: PostCheckInput = {
      status: "PUBLISHED",
      publishedAt: new Date("2026-10-22T08:00:00Z"), // tomorrow
    };
    expect(isPostPubliclyVisible(futurePost, now)).toBe(false);
  });

  it("hides published posts with null publication date", () => {
    const invalidPost: PostCheckInput = {
      status: "PUBLISHED",
      publishedAt: null,
    };
    expect(isPostPubliclyVisible(invalidPost, now)).toBe(false);
  });
});
