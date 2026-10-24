import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Post, PostSummary } from "@/lib/posts";

export interface ArticleCardProps {
  post: Post | PostSummary;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = formatDisplayDate(post.date, "short");

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border border-outline-variant/40 bg-surface-container p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-outline-variant/80 hover:shadow-paper">
      <div className="space-y-4">
        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-medium">
            <Calendar className="h-3 w-3 text-foreground" />
            <time dateTime={post.date} suppressHydrationWarning>
              {formattedDate}
            </time>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-medium">
            <Clock className="h-3 w-3 text-foreground" />
            <span>{post.readingTime} min read</span>
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-foreground">
            <Link
              href={`/posts/${post.slug}`}
              prefetch={false}
              className="focus:outline-none"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h2>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all duration-200 group-hover:bg-white dark:group-hover:bg-surface-container-highest group-hover:text-foreground group-hover:shadow-sm">
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant font-normal">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
