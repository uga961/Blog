import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleList } from "@/components/blog/ArticleList";
import { ActivityShowcase } from "@/components/blog/ActivityShowcase";
import { siteConfig } from "@/lib/config";
import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import {
  Github,
  Linkedin,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Youtube,
  Rss,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { FaRedditAlien } from "react-icons/fa";
import Image from "next/image";

export default function HomePage() {
  const posts = getAllPosts(false).map(({ content, ...summary }) => summary);
  const featured = getFeaturedPost();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 space-y-14">
        {/* Author Intro Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container p-6 sm:p-10 shadow-paper">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              {/* Tonal Warm Bone / Carbon Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-outline-variant/60 bg-surface-container-high text-foreground font-mono text-xl font-bold shadow-xs">
                {siteConfig.author.initials}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                    {siteConfig.name}
                  </h1>
                </div>
                <p className="text-sm font-medium text-foreground/90">
                  {siteConfig.tagline}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl leading-relaxed pt-1">
                  {siteConfig.bio}
                </p>
              </div>
            </div>

            {/* Social Link Chips - Tactile Elevation */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 sm:flex-col sm:items-end">
              {siteConfig.author.social.website && (
                <a
                  href={siteConfig.author.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-high px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Globe className="h-3.5 w-3.5 text-foreground" />
                  <span>Portfolio</span>
                  <ArrowUpRight className="h-3 w-3 text-on-surface-variant/70" />
                </a>
              )}
              {siteConfig.author.social.github && (
                <a
                  href={siteConfig.author.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-high px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Github className="h-3.5 w-3.5 text-foreground" />
                  <span>GitHub</span>
                </a>
              )}
              {siteConfig.author.social.youtube && (
                <a
                  href={siteConfig.author.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-high px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Youtube className="h-3.5 w-3.5 text-[#ef4444]" />
                  <span>YouTube</span>
                </a>
              )}
              {siteConfig.author.social.reddit && (
                <a
                  href={siteConfig.author.social.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-high px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <FaRedditAlien className="h-3.5 w-3.5 text-[#ff4500]" />
                  <span>Reddit</span>
                </a>
              )}
              {siteConfig.author.social.linkedin && (
                <a
                  href={siteConfig.author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-high px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Linkedin className="h-3.5 w-3.5 text-[#0a66c2]" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Sneak Peek: Featured / Latest Article Card */}
        {featured && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Latest Story Preview</span>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container p-6 sm:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-outline-variant/80 hover:shadow-paper">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {featured.coverImage && (
                  <div className="md:col-span-5 overflow-hidden rounded-2xl border border-outline-variant/30 shadow-xs">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      width={640}
                      height={400}
                      sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 1024px) 380px, 320px"
                      quality={60}
                      priority
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div
                  className={`${featured.coverImage ? "md:col-span-7" : "md:col-span-12"} space-y-3`}
                >
                  {/* Chips row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-medium">
                      <Calendar className="h-3 w-3 text-foreground" />
                      <time dateTime={featured.date} suppressHydrationWarning>
                        {formatDisplayDate(featured.date, "long")}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-medium">
                      <Clock className="h-3 w-3 text-foreground" />
                      <span>{featured.readingTime} min read</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-on-surface group-hover:text-foreground transition-colors">
                    <Link href={`/posts/${featured.slug}`} prefetch={false}>
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      />
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant font-normal">
                    {featured.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span>Read full article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GitHub & Spotify Live Activity */}
        <ActivityShowcase />

        {/* All Articles Section */}
        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                All Articles
              </h2>
            </div>
            <span className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-semibold text-on-surface-variant">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>

          <ArticleList posts={posts} postsPerPage={6} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
