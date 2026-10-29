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
import { MagneticDock } from "@/components/ui/MagneticDock";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const posts = getAllPosts(false).map(({ content, ...summary }) => summary);
  const featured = getFeaturedPost();

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface relative selection:bg-foreground/15 selection:text-foreground pb-24 sm:pb-28">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Author Intro Hero Banner */}
        <HeroBanner totalPosts={posts.length} />

        {/* Featured Story / Latest Release Preview */}
        {featured && (
          <section id="featured" className="scroll-mt-28 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-3 text-xs font-mono text-on-surface-variant">
              <div className="flex items-center gap-2 sm:gap-3 truncate">
                <span className="text-foreground font-semibold uppercase tracking-wider flex-shrink-0">INDEX 002</span>
                <span className="text-border flex-shrink-0">/</span>
                <span className="truncate">LATEST ESSAY RELEASE</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/40" />
                <span>FEATURED DISPATCH</span>
              </div>
            </div>

            <div className="rounded-[4px] border border-border/80 bg-surface/60 p-5 sm:p-7 transition-colors hover:border-foreground/30 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                {featured.coverImage && (
                  <div className="md:col-span-5 overflow-hidden rounded-[3px] border border-border/80 bg-surface-container aspect-[16/10] relative">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 380px, 340px"
                      priority
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                  </div>
                )}

                <div
                  className={`${featured.coverImage ? "md:col-span-7" : "md:col-span-12"} space-y-3.5`}
                >
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                    <span className="text-foreground font-semibold">
                      <time dateTime={featured.date} suppressHydrationWarning>
                        {formatDisplayDate(featured.date, "long")}
                      </time>
                    </span>
                    <span className="text-border">·</span>
                    <span>{featured.readingTime} min read</span>
                    {featured.tags && featured.tags.length > 0 && (
                      <>
                        <span className="text-border">·</span>
                        <span className="text-on-surface-variant/80">{featured.tags[0]}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:underline transition-colors leading-snug">
                    <Link href={`/posts/${featured.slug}`} prefetch={false}>
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant font-sans">
                    {featured.excerpt}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/posts/${featured.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground uppercase tracking-wider hover:underline touch-manipulation"
                    >
                      <span>Read Full Essay</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Live Spotify Turntable & GitHub Showcase */}
        <ActivityShowcase />

        {/* All Articles Section */}
        <section id="articles" className="scroll-mt-28 space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 text-xs font-mono text-on-surface-variant">
            <div className="flex items-center gap-2 sm:gap-3 truncate">
              <span className="text-foreground font-semibold uppercase tracking-wider flex-shrink-0">INDEX 004</span>
              <span className="text-border flex-shrink-0">/</span>
              <span className="truncate">ALL ESSAYS &amp; TECHNICAL NOTES</span>
            </div>
            <span className="font-mono text-[11px] text-foreground font-semibold flex-shrink-0">
              {posts.length} {posts.length === 1 ? "DOCUMENT" : "DOCUMENTS"}
            </span>
          </div>

          <ArticleList posts={posts} postsPerPage={6} />
        </section>
      </main>

      <Footer />

      {/* Floating Quick Navigation Dock */}
      <MagneticDock />
    </div>
  );
}
