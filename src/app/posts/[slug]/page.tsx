import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/config";
import { getSession } from "@/lib/session";
import { extractTableOfContents } from "@/lib/markdown";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Clock, Calendar, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const now = new Date();

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        title: true,
        excerpt: true,
        coverImage: true,
        status: true,
        publishedAt: true,
      },
    });

    if (!post || (post.status !== "PUBLISHED" && (!post.publishedAt || post.publishedAt > now))) {
      return {
        title: "Article Not Found",
      };
    }

    const postUrl = `${siteConfig.url}/posts/${slug}`;
    const ogImages = post.coverImage ? [{ url: post.coverImage }] : [];

    return {
      title: post.title,
      description: post.excerpt || `${post.title} — Written by ${siteConfig.name}`,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt || `${post.title} — Written by ${siteConfig.name}`,
        url: postUrl,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        images: ogImages,
      },
      twitter: {
        card: post.coverImage ? "summary_large_image" : "summary",
        title: post.title,
        description: post.excerpt || post.title,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch {
    return {
      title: "Article",
    };
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const now = new Date();

  // Find post by slug
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Publication gate: Only published posts with publishedAt <= now are visible publicly.
  // Admins can preview their own drafts or scheduled posts.
  const isPubliclyAvailable =
    post.status === "PUBLISHED" &&
    post.publishedAt !== null &&
    post.publishedAt <= now;

  if (!isPubliclyAvailable && !isAdmin) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
    : "Draft (Unpublished)";

  const tocItems = extractTableOfContents(post.content);
  const articleUrl = `${siteConfig.url}/posts/${post.slug}`;

  // Find related articles (matching tags or recent published)
  const tagIds = post.tags.map((t) => t.tagId);
  const relatedPosts = await prisma.post.findMany({
    where: {
      id: { not: post.id },
      status: "PUBLISHED",
      publishedAt: { lte: now },
      ...(tagIds.length > 0
        ? {
            tags: {
              some: { tagId: { in: tagIds } },
            },
          }
        : {}),
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      readingTime: true,
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ReadingProgressBar />
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        {/* Admin Preview Banner if post is draft or scheduled */}
        {!isPubliclyAvailable && isAdmin && (
          <div className="mb-8 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <strong>Admin Preview Mode:</strong> This post is currently{" "}
                <Badge variant={post.status === "SCHEDULED" ? "scheduled" : "draft"}>
                  {post.status}
                </Badge>{" "}
                and is not visible to public readers.
              </span>
            </div>
            <Link
              href={`/admin/editor/${post.id}`}
              className="font-medium underline hover:text-foreground"
            >
              Edit in Dashboard
            </Link>
          </div>
        )}

        {/* Back Link Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all essays</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 space-y-4 border-b border-border/60 pb-8">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ""}>
                {formattedDate}
              </time>
            </div>
            <span className="text-border" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {post.tags.map(({ tag }) => (
                <Badge key={tag.slug} variant="default" size="sm">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-border/70 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-auto w-full object-cover max-h-[440px]"
            />
          </div>
        )}

        {/* Table of contents */}
        {tocItems.length > 1 && <TableOfContents items={tocItems} />}

        {/* Main Article Body */}
        <div className="mb-14">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* End of article: Share and Author Info */}
        <section className="space-y-8 border-t border-border/70 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              Published on <span className="text-foreground font-medium">{formattedDate}</span>
            </div>
            <ShareButtons title={post.title} url={articleUrl} />
          </div>

          {/* Author Bio Box */}
          <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-base font-bold text-accent">
              {siteConfig.author.initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Written by {siteConfig.name}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {siteConfig.bio}
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Read Next
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((r) => (
                  <Link
                    key={r.id}
                    href={`/posts/${r.slug}`}
                    className="group rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="text-[11px] text-muted-foreground">
                      {r.publishedAt ? format(new Date(r.publishedAt), "MMM d, yyyy") : ""} • {r.readingTime} min read
                    </span>
                    <h4 className="mt-1 font-serif text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
