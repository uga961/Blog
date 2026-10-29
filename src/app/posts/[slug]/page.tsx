import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { siteConfig } from "@/lib/config";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { extractTableOfContents } from "@/lib/markdown";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { MagneticDock } from "@/components/ui/MagneticDock";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

const SITE_URL = "https://blog.ugandhar.in";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts(false);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, true);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const postUrl = `${SITE_URL}/posts/${post.slug}`;
  const description =
    post.excerpt || `${post.title} — Written by ${siteConfig.name}`;

  const ogImages = post.coverImage
    ? [{ url: post.coverImage, alt: post.title, width: 1200, height: 630 }]
    : [
        {
          url: `${SITE_URL}/social/og-image blog.png`,
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ];

  return {
    title: post.title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.date || undefined,
      authors: [siteConfig.name],
      images: ogImages,
      siteName: "Ugandhar's Journal",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, true);

  if (!post) {
    notFound();
  }

  const formattedDate = formatDisplayDate(post.date, "long");
  const tocItems = extractTableOfContents(post.content);
  const articleUrl = `${SITE_URL}/posts/${post.slug}`;

  // Find related articles (matching tags or other recent posts)
  const allPosts = getAllPosts(false);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatches = a.tags.filter((t) => post.tags.includes(t)).length;
      const bMatches = b.tags.filter((t) => post.tags.includes(t)).length;
      return bMatches - aMatches;
    })
    .slice(0, 2);

  // JSON-LD Article structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    url: articleUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Ugandhar Vaddi",
      url: "https://www.ugandhar.in",
      image: "https://www.ugandhar.in/avatar/profile.jpg",
    },
    publisher: {
      "@type": "Person",
      name: "Ugandhar Vaddi",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ugandhar.in/icon.png",
      },
    },
    image: post.coverImage || `${SITE_URL}/social/og-image blog.png`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.tags.join(", "),
    wordCount: post.content.split(/\s+/).length,
    articleSection: post.tags[0] || "Engineering",
    inLanguage: "en-US",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface relative selection:bg-foreground/15 selection:text-foreground pb-24 sm:pb-28">
      <ReadingProgressBar />
      <Header />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 pt-24 sm:pt-28 pb-14">
        {/* Back Navigation Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-[3px] border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-mono font-medium text-foreground transition-colors hover:border-foreground touch-manipulation"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Essays</span>
          </Link>
        </div>

        {/* Article Header — Unboxed Editorial Typography */}
        <header className="mb-8 sm:mb-10 space-y-4 sm:space-y-5">
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <span className="text-foreground font-semibold">
              <time dateTime={post.date} suppressHydrationWarning>
                {formattedDate}
              </time>
            </span>
            <span className="text-border">·</span>
            <span>{post.readingTime} min read</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-border">·</span>
                <span className="text-on-surface-variant/80">{post.tags[0]}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.2] break-words">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg leading-relaxed text-on-surface-variant font-sans">
              {post.excerpt}
            </p>
          )}

          {/* Tag Chips */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[3px] border border-border/80 bg-surface/50 px-2 py-0.5 text-[11px] font-mono text-on-surface-variant"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-10 overflow-hidden rounded-[4px] border border-border/80 bg-surface-container shadow-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-auto w-full object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Table of Contents */}
        {tocItems.length > 1 && <TableOfContents items={tocItems} />}

        {/* Centered Markdown Content Column */}
        <div className="mx-auto max-w-reading mb-14">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Bottom Actions & Author Info */}
        <section className="space-y-8 border-t border-border/80 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-xs">
            <span className="text-on-surface-variant">
              Archived on{" "}
              <strong className="text-foreground font-semibold">
                {formattedDate}
              </strong>
            </span>
            <ShareButtons title={post.title} url={articleUrl} />
          </div>

          {/* Author Card */}
          <div className="rounded-[4px] border border-border/80 bg-surface/60 p-5 sm:p-6 flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-[3px] border border-border/80 bg-surface text-foreground font-mono text-base sm:text-lg font-bold">
              {siteConfig.author.initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground font-sans">
                {siteConfig.name}
              </h3>
              <p className="text-xs text-foreground/80 font-mono">
                {siteConfig.tagline}
              </p>
              <p className="text-xs leading-relaxed text-on-surface-variant pt-1 font-sans">
                {siteConfig.bio}
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                Continue Reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/posts/${r.slug}`}
                    className="group flex flex-col justify-between rounded-[4px] border border-border/80 bg-surface/40 p-4 sm:p-5 transition-colors hover:border-foreground/30 hover:bg-surface/70"
                  >
                    <div className="space-y-1.5">
                      <span
                        className="text-[11px] font-mono text-on-surface-variant"
                        suppressHydrationWarning
                      >
                        {formatDisplayDate(r.date, "short")} · {r.readingTime} min read
                      </span>
                      <h4 className="font-serif text-base font-bold text-foreground group-hover:underline transition-colors line-clamp-2 leading-snug">
                        {r.title}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-mono font-semibold text-foreground">
                      <span>Read essay</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Floating Quick Navigation Dock */}
      <MagneticDock />
    </div>
  );
}
