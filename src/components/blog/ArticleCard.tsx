import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { ArrowUpRight, Clock, Calendar, Tag } from "lucide-react";
import { Post, PostSummary } from "@/lib/posts";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export interface ArticleCardProps {
  post: Post | PostSummary;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = formatDisplayDate(post.date, "short");

  return (
    <SpotlightCard className="group relative flex flex-col justify-between p-5 sm:p-7">
      <div className="space-y-4">
        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-medium border border-outline-variant/30">
            <Calendar className="h-3 w-3 text-foreground/70" />
            <time dateTime={post.date} suppressHydrationWarning>
              {formattedDate}
            </time>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-medium border border-outline-variant/30">
            <Clock className="h-3 w-3 text-foreground/70" />
            <span>{post.readingTime} min read</span>
          </span>
          {post.tags && post.tags.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-highest px-2.5 py-1 text-[11px] font-medium text-foreground/80">
              <Tag className="h-2.5 w-2.5 opacity-60" />
              <span>{post.tags[0]}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-foreground">
            <Link
              href={`/posts/${post.slug}`}
              prefetch={false}
              className="focus:outline-none"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h3>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant transition-all duration-200 group-hover:bg-white dark:group-hover:bg-surface-container-highest group-hover:text-foreground group-hover:shadow-sm">
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

      {/* Footer tags preview if multiple */}
      {post.tags && post.tags.length > 1 && (
        <div className="pt-4 mt-2 border-t border-outline-variant/20 flex flex-wrap gap-1.5">
          {post.tags.slice(1, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-container/80 text-on-surface-variant"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </SpotlightCard>
  );
}
