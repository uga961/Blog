import React from "react";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/date";
import { ArrowUpRight } from "lucide-react";
import { Post, PostSummary } from "@/lib/posts";

export interface ArticleCardProps {
  post: Post | PostSummary;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = formatDisplayDate(post.date, "short");

  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch={false}
      className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start group block touch-manipulation hover:bg-surface/40 -mx-3 px-3 rounded-[4px] transition-colors"
    >
      {/* Left Column: Metadata */}
      <div className="md:col-span-3 space-y-1 text-xs font-mono text-on-surface-variant">
        <div className="text-foreground font-semibold">
          <time dateTime={post.date} suppressHydrationWarning>
            {formattedDate}
          </time>
        </div>
        <div>
          {post.readingTime} min read
        </div>
      </div>

      {/* Right Column: Title, Excerpt, Tags, Arrow */}
      <div className="md:col-span-9 space-y-2.5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground group-hover:underline transition-colors leading-snug break-words">
            {post.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1" />
        </div>

        {post.excerpt && (
          <p className="text-sm text-on-surface-variant leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="pt-1 text-xs font-mono text-on-surface-variant/80 break-words">
            <span>{post.tags.join(" · ")}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
