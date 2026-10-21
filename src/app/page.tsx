import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleList } from "@/components/blog/ArticleList";
import { siteConfig } from "@/lib/config";
import prisma from "@/lib/prisma";
import { Github, Twitter, Linkedin, ArrowDown } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPublishedPostsData() {
  const now = new Date();

  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: now,
        },
      },
      orderBy: { publishedAt: "desc" },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    // Compute tag counts
    const tagMap = new Map<string, { name: string; slug: string; count: number }>();
    for (const post of posts) {
      for (const { tag } of post.tags) {
        const existing = tagMap.get(tag.slug);
        if (existing) {
          existing.count += 1;
        } else {
          tagMap.set(tag.slug, { name: tag.name, slug: tag.slug, count: 1 });
        }
      }
    }

    const allTags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);

    return { posts, allTags };
  } catch (err) {
    console.warn("Could not load posts from database:", err);
    return { posts: [], allTags: [] };
  }
}

export default async function HomePage() {
  const { posts, allTags } = await getPublishedPostsData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        {/* Author Bio / Intro Hero */}
        <section className="mb-14 space-y-5 border-b border-border/60 pb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 font-mono text-lg font-bold text-accent shadow-xs">
              {siteConfig.author.initials}
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            {siteConfig.bio}
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            {siteConfig.author.social.github && (
              <a
                href={siteConfig.author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border/70 px-2.5 py-1 transition-colors hover:border-accent hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {siteConfig.author.social.twitter && (
              <a
                href={siteConfig.author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border/70 px-2.5 py-1 transition-colors hover:border-accent hover:text-foreground"
              >
                <Twitter className="h-3.5 w-3.5" />
                <span>Twitter</span>
              </a>
            )}
            {siteConfig.author.social.linkedin && (
              <a
                href={siteConfig.author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border/70 px-2.5 py-1 transition-colors hover:border-accent hover:text-foreground"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </section>

        {/* Section Heading & Article List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>Selected Essays & Writing</span>
              <ArrowDown className="h-3 w-3 text-accent" />
            </h2>
            <span className="text-xs text-muted-foreground">
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
