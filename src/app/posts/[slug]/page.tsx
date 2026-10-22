import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { siteConfig } from "@/lib/config";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { extractTableOfContents } from "@/lib/markdown";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // const { slug } = await params;
  // const post = getPostBySlug(slug);

  // if (!post) {
  //   return { title: "Article Not Found" };
  // }

  // const postUrl = `${siteConfig.url}/posts/${slug}`;
  // const ogImages = post.coverImage ? [{ url: post.coverImage }] : [];

  // return {
  //   title: post.title,
  //   description: post.excerpt || `${post.title} — Written by ${siteConfig.name}`,
  //   alternates: {
  //     canonical: postUrl,
  //   },
  //   openGraph: {
  //     title: post.title,
  //     description: post.excerpt || `${post.title} — Written by ${siteConfig.name}`,
  //     url: postUrl,
  //     type: "article",
  //     publishedTime: post.date,
  //     images: ogImages,
  //   },
  //   twitter: {
  //     card: post.coverImage ? "summary_large_image" : "summary",
  //     title: post.title,
  //     description: post.excerpt || post.title,
  //     images: post.coverImage ? [post.coverImage] : [],
  //   },
  // };
// }


export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postUrl = new URL(
    `/posts/${post.slug}`,
    siteConfig.url
  ).toString();

  const description = post.excerpt?.trim()
    || `Read ${post.title} by ${siteConfig.name}.`;

  const images = post.coverImage
    ? [{ url: post.coverImage, alt: post.title }]
    : undefined;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      siteName: siteConfig.name,
      title: post.title,
      description,
      publishedTime: post.date,
      authors: [siteConfig.name],
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}


export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, true);

  if (!post) {
    notFound();
  }

  const formattedDate = post.date
    ? format(new Date(post.date), "MMMM d, yyyy")
    : "Recent";

  const tocItems = extractTableOfContents(post.content);
  const articleUrl = `${siteConfig.url}/posts/${post.slug}`;

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ReadingProgressBar />
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        {/* Floating Back Navigation Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header Card */}
        <header className="mb-10 space-y-5 rounded-3xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-10 shadow-xs">
          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3.5 py-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <time dateTime={post.date}>{formattedDate}</time>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3.5 py-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.2]">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg leading-relaxed text-on-surface-variant font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Tag Chips */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="tonal" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-outline-variant/30 shadow-md">
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
        <section className="space-y-8 border-t border-outline-variant/30 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs text-on-surface-variant">
              Published on <strong className="text-on-surface font-semibold">{formattedDate}</strong>
            </span>
            <ShareButtons title={post.title} url={articleUrl} />
          </div>

          {/* Author Card */}
          <div className="flex items-start gap-5 rounded-3xl border border-outline-variant/30 bg-surface-container p-6 shadow-xs">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-primary-on-container font-mono text-lg font-bold">
              {siteConfig.author.initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface">
                {siteConfig.name}
              </h3>
              <p className="text-xs text-primary font-medium">
                {siteConfig.tagline}
              </p>
              <p className="text-xs leading-relaxed text-on-surface-variant pt-1">
                {siteConfig.bio}
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Continue Reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/posts/${r.slug}`}
                    className="group flex flex-col justify-between rounded-3xl border border-outline-variant/30 bg-surface-container-low p-5 transition-all hover:border-primary/40 hover:bg-surface-container hover:shadow-md"
                  >
                    <div>
                      <span className="text-[11px] font-medium text-on-surface-variant">
                        {r.date} • {r.readingTime} min read
                      </span>
                      <h4 className="mt-1 font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
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
    </div>
  );
}
