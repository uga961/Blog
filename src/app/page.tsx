import Link from "next/link";
import { format } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleList } from "@/components/blog/ArticleList";
import { siteConfig } from "@/lib/config";
import { getAllPosts, getAllTags, getFeaturedPost } from "@/lib/posts";
import { Github, Twitter, Linkedin, ArrowRight, Sparkles, Calendar, Clock, BookOpen, Youtube } from "lucide-react";

export default function HomePage() {
  const posts = getAllPosts(false);
  const allTags = getAllTags();
  const featured = getFeaturedPost();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 space-y-14">
        {/* Author Intro Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              {/* Material 3 Tonal Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary-container text-primary-on-container font-mono text-xl font-bold shadow-xs">
                {siteConfig.author.initials}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                    {siteConfig.name}
                  </h1>
                </div>
                <p className="text-sm font-medium text-primary">
                  {siteConfig.tagline}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl leading-relaxed pt-1">
                  {siteConfig.bio}
                </p>
              </div>
            </div>

            {/* Social Link Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 sm:flex-col sm:items-end">
              {siteConfig.author.social.github && (
                <a
                  href={siteConfig.author.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors shadow-xs"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {siteConfig.author.social.youtube && (
                <a
                  href={siteConfig.author.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors shadow-xs"
                >
                  <Youtube className="h-3.5 w-3.5" />
                  <span>YouTube</span>
                </a>
              )}
              {siteConfig.author.social.linkedin && (
                <a
                  href={siteConfig.author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors shadow-xs"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Sneak Peek: Featured / Latest Article Card */}
        {featured && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Latest Story Preview</span>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-outline-variant/35 bg-surface-container p-6 sm:p-8 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-container-high hover:shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {featured.coverImage && (
                  <div className="md:col-span-5 overflow-hidden rounded-2xl border border-outline-variant/20 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className={`${featured.coverImage ? "md:col-span-7" : "md:col-span-12"} space-y-3`}>
                  {/* Chips row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-medium">
                      <Calendar className="h-3 w-3 text-primary" />
                      <time dateTime={featured.date}>
                        {format(new Date(featured.date), "MMMM d, yyyy")}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-medium">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{featured.readingTime} min read</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                    <Link href={`/posts/${featured.slug}`}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant font-normal">
                    {featured.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primary">
                    <span>Read full article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Articles Section */}
        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-outline-variant/25 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                All Articles
              </h2>
            </div>
            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>

          <ArticleList posts={posts} allTags={allTags} postsPerPage={6} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
