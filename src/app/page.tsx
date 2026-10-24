import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDisplayDate } from "@/lib/date";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleList } from "@/components/blog/ArticleList";
import { ActivityShowcase } from "@/components/blog/ActivityShowcase";
import { HeroBanner } from "@/components/blog/HeroBanner";
import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticDock } from "@/components/ui/MagneticDock";
import {
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const posts = getAllPosts(false).map(({ content, ...summary }) => summary);
  const featured = getFeaturedPost();

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface relative selection:bg-foreground/15 pb-20 sm:pb-16">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-14 space-y-16">
        {/* Author Intro Hero Banner (Client Component for Confetti & Copy Interaction) */}
        <HeroBanner totalPosts={posts.length} />

        {/* Featured Story / Latest Release Preview */}
        {featured && (
          <section id="featured" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Latest Story Preview</span>
            </div>

            <SpotlightCard className="p-6 sm:p-8">
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
                      className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div
                  className={`${featured.coverImage ? "md:col-span-7" : "md:col-span-12"} space-y-3.5`}
                >
                  {/* Chips row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface-variant">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-medium border border-outline-variant/30">
                      <Calendar className="h-3 w-3 text-foreground/70" />
                      <time dateTime={featured.date} suppressHydrationWarning>
                        {formatDisplayDate(featured.date, "long")}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-medium border border-outline-variant/30">
                      <Clock className="h-3 w-3 text-foreground/70" />
                      <span>{featured.readingTime} min read</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-on-surface group-hover:text-foreground transition-colors">
                    <Link href={`/posts/${featured.slug}`} prefetch={false}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant font-normal">
                    {featured.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
                    <span>Read full article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </section>
        )}

        {/* Live Spotify Vinyl & GitHub Showcase */}
        <ActivityShowcase />

        {/* All Articles Section */}
        <section id="articles" className="scroll-mt-28 space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-on-surface">
                All Articles
              </h2>
            </div>
            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-mono font-semibold text-on-surface-variant border border-outline-variant/30">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>

          <ArticleList posts={posts} postsPerPage={6} />
        </section>
      </main>

      <Footer />

      {/* Floating Magnetic Dock Navigation */}
      <MagneticDock />
    </div>
  );
}
