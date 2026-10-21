import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getUniqueSlug } from "@/lib/slug";
import { calculateReadingTime, extractExcerpt } from "@/lib/markdown";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishedAt: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && err.message === "Unauthorized";
    return NextResponse.json(
      { error: isAuth ? "Unauthorized" : "Failed to fetch post" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await req.json();

    const parseResult = updatePostSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check existing post
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Ensure slug uniqueness excluding this post
    const finalSlug = await getUniqueSlug(data.slug, id);

    // Compute reading time
    const readingTime = calculateReadingTime(data.content);

    // Excerpt
    const finalExcerpt = data.excerpt?.trim() || extractExcerpt(data.content);

    // Publication date logic
    let publishedAt: Date | null = existing.publishedAt;
    if (data.status === "PUBLISHED") {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : existing.publishedAt || new Date();
    } else if (data.status === "SCHEDULED") {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
    } else {
      publishedAt = null;
    }

    const updatedPost = await prisma.$transaction(async (tx) => {
      // 1. Update post fields
      const post = await tx.post.update({
        where: { id },
        data: {
          title: data.title,
          slug: finalSlug,
          excerpt: finalExcerpt,
          content: data.content,
          coverImage: data.coverImage || null,
          status: data.status,
          publishedAt,
          readingTime,
        },
      });

      // 2. Remove old tags
      await tx.postTag.deleteMany({
        where: { postId: id },
      });

      // 3. Connect new tags
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          const cleanName = tagName.trim();
          if (!cleanName) continue;
          const tagSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-");

          const tag = await tx.tag.upsert({
            where: { name: cleanName },
            create: { name: cleanName, slug: tagSlug },
            update: {},
          });

          await tx.postTag.create({
            data: {
              postId: id,
              tagId: tag.id,
            },
          });
        }
      }

      return tx.post.findUnique({
        where: { id },
        include: { tags: { include: { tag: true } } },
      });
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && err.message === "Unauthorized";
    console.error("Update post error:", err);
    return NextResponse.json(
      { error: isAuth ? "Unauthorized" : "Failed to update post" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && err.message === "Unauthorized";
    return NextResponse.json(
      { error: isAuth ? "Unauthorized" : "Failed to delete post" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
