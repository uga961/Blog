import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getUniqueSlug } from "@/lib/slug";
import { calculateReadingTime, extractExcerpt } from "@/lib/markdown";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT"),
  publishedAt: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "ALL";

    // Where clause
    const where: Record<string, unknown> = {};
    if (statusFilter !== "ALL") {
      where.status = statusFilter;
    }
    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, totalCount, publishedCount, draftCount, scheduledCount] =
      await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          include: {
            tags: {
              include: { tag: true },
            },
          },
        }),
        prisma.post.count(),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
        prisma.post.count({ where: { status: "DRAFT" } }),
        prisma.post.count({ where: { status: "SCHEDULED" } }),
      ]);

    return NextResponse.json({
      posts,
      stats: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        scheduled: scheduledCount,
      },
    });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && err.message === "Unauthorized";
    return NextResponse.json(
      { error: isAuth ? "Unauthorized" : "Failed to fetch posts" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const parseResult = createPostSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Resolve unique slug
    const finalSlug = await getUniqueSlug(data.slug || data.title);

    // Calculate reading time
    const readingTime = calculateReadingTime(data.content);

    // Auto-generate excerpt if empty
    const finalExcerpt = data.excerpt?.trim() || extractExcerpt(data.content);

    // Compute publish date
    let publishedAt: Date | null = null;
    if (data.status === "PUBLISHED") {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
    } else if (data.status === "SCHEDULED" && data.publishedAt) {
      publishedAt = new Date(data.publishedAt);
    }

    // Process Tags: upsert tag records
    const post = await prisma.$transaction(async (tx) => {
      const createdPost = await tx.post.create({
        data: {
          title: data.title,
          slug: finalSlug,
          excerpt: finalExcerpt,
          content: data.content,
          coverImage: data.coverImage || null,
          status: data.status,
          publishedAt,
          readingTime,
          authorId: session.userId,
        },
      });

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
              postId: createdPost.id,
              tagId: tag.id,
            },
          });
        }
      }

      return tx.post.findUnique({
        where: { id: createdPost.id },
        include: { tags: { include: { tag: true } } },
      });
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && err.message === "Unauthorized";
    console.error("Create post error:", err);
    return NextResponse.json(
      { error: isAuth ? "Unauthorized" : "Failed to create post" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
