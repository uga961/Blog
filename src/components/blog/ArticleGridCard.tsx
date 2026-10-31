import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDisplayDate } from "@/lib/date";
import { ArrowUpRight } from "lucide-react";
import { Post, PostSummary } from "@/lib/posts";

export interface ArticleGridCardProps {
  post: Post | PostSummary;
}

export function ArticleGridCard({ post }: ArticleGridCardProps) {
  const formattedDate = formatDisplayDate(post.date, "short");

  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch={false}
      className="group flex flex-col justify-between rounded-[4px] border border-border/80 bg-surface/50 p-4 sm:p-5 transition-all hover:border-foreground/30 hover:bg-surface/80 shadow-subtle touch-manipulation"
    >
      <div className="space-y-3.5">
        {/* Cover Image if present */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3px] border border-border/70 bg-surface-container">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition-all duration-300"
            />
          </div>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
          <span className="text-foreground font-semibold">
            <time dateTime={post.date} suppressHydrationWarning>
              {formattedDate}
            </time>
          </span>
          <span className="text-border">·</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-serif font-bold text-foreground group-hover:underline transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </div>

      <div className="pt-4 mt-auto border-t border-border/60 flex items-center justify-between text-xs font-mono">
        <span className="text-on-surface-variant text-[11px] truncate max-w-[200px]">
          {post.tags && post.tags.length > 0 ? `#${post.tags[0]}` : "Article"}
        </span>
        <div className="flex items-center gap-1 font-semibold text-foreground group-hover:underline">
          <span>Read</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
