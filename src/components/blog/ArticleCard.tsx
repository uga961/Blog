import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Post } from "@/lib/posts";

export interface ArticleCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
}

export function ArticleCard({ post, onTagClick }: ArticleCardProps) {
  const formattedDate = post.date
    ? format(new Date(post.date), "MMM d, yyyy")
    : "Recent";

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border border-outline-variant/30 bg-surface-container-low p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-container hover:shadow-md">
      <div className="space-y-4">
        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-medium">
            <Calendar className="h-3 w-3 text-primary" />
            <time dateTime={post.date}>{formattedDate}</time>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-medium">
            <Clock className="h-3 w-3 text-primary" />
            <span>{post.readingTime} min read</span>
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary">
            <Link href={`/posts/${post.slug}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h2>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container transition-all group-hover:bg-primary-container group-hover:text-primary-on-container">
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

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 pt-5">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="focus:outline-none"
            >
              <Badge
                variant="outline"
                size="sm"
                className="hover:border-primary hover:bg-primary-container hover:text-primary-on-container cursor-pointer"
              >
                #{tag}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
