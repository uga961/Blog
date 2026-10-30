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
  const authorName = "Ugandhar Vaddi";

  // Format: [Title] by Ugandhar Vaddi (strictly <= 68 chars for Bing & Google search snippets)
  let seoTitle = post.seoTitle;
  if (!seoTitle) {
    const candidate = `${post.title} by ${authorName}`;
    if (candidate.length <= 68) {
      seoTitle = candidate;
    } else {
      const shortened = post.title.split(":")[0].slice(0, 45).trim();
      seoTitle = `${shortened} by ${authorName}`;
    }
  }

  const description =
    post.excerpt || `${post.title} — Written by ${authorName}`;

  const cleanOgImage =
    post.coverImage && post.coverImage.trim() !== ""
      ? post.coverImage
      : `${SITE_URL}/social/og-image.png`;

  const ogImages = [
    {
      url: cleanOgImage,
      alt: seoTitle,
      width: 1200,
      height: 630,
    },
  ];

  return {
    title: {
      absolute: seoTitle,
    },
    description,
    authors: [{ name: siteConfig.name, url: "https://www.ugandhar.in" }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: seoTitle,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      modifiedTime: post.date ? new Date(post.date).toISOString() : undefined,
      authors: [siteConfig.name],
      tags: post.tags,
      images: ogImages,
      siteName: `${siteConfig.name}'s Blog`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [cleanOgImage],
      creator: "@uga961",
      site: "@uga961",
    },
    other: {
      "dc.creator": siteConfig.name,
      "dc.title": seoTitle,
      "dc.description": description,
      "article:published_time": post.date ? new Date(post.date).toISOString() : "",
      "article:author": siteConfig.name,
      "article:tag": post.tags.join(", "),
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

  const cleanOgImage =
    post.coverImage && post.coverImage.trim() !== ""
      ? post.coverImage
      : `${SITE_URL}/social/og-image.png`;

  const isoDate = post.date ? new Date(post.date).toISOString() : new Date().toISOString();
  const authorName = "Ugandhar Vaddi";

  let seoTitle = post.seoTitle;
  if (!seoTitle) {
    const candidate = `${post.title} by ${authorName}`;
    if (candidate.length <= 68) {
      seoTitle = candidate;
    } else {
      const shortened = post.title.split(":")[0].slice(0, 45).trim();
      seoTitle = `${shortened} by ${authorName}`;
    }
  }

  // Rich JSON-LD structured data for Google Search (BlogPosting + BreadcrumbList)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        isPartOf: {
          "@type": "Blog",
          "@id": `${SITE_URL}/#blog`,
          name: "Ugandhar Vaddi — Personal Blog",
          url: SITE_URL,
        },
        headline: seoTitle,
        name: seoTitle,
        description: post.excerpt || post.title,
        url: articleUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        datePublished: isoDate,
        dateModified: isoDate,
        author: {
          "@type": "Person",
          "@id": "https://www.ugandhar.in/#person",
          name: siteConfig.name,
          url: "https://www.ugandhar.in",
          image: "https://www.ugandhar.in/avatar/profile.jpg",
          sameAs: [
            "https://github.com/uga961",
            "https://www.linkedin.com/in/vaddi-ugandhar-b37877266/",
            "https://www.youtube.com/@uga961",
            "https://blog.ugandhar.in",
            "https://www.reddit.com/user/uga961/",
          ],
        },
        publisher: {
          "@type": "Person",
          "@id": "https://www.ugandhar.in/#person",
          name: siteConfig.name,
          url: "https://www.ugandhar.in",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icon.png`,
          },
        },
        image: [cleanOgImage],
        keywords: post.tags.join(", "),
        wordCount: post.content.split(/\s+/).length,
        articleSection: post.tags[0] || "Engineering",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Articles",
            item: `${SITE_URL}/#articles`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
    ],
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
            <span>Back to All Articles</span>
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
                      <span>Read article</span>
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
