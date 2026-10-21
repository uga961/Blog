import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "lucide-react";

export interface ArticleCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    publishedAt: Date | string | null;
    readingTime: number;
    tags?: { tag: { name: string; slug: string } }[];
  };
  onTagClick?: (tagSlug: string) => void;
}

export function ArticleCard({ post, onTagClick }: ArticleCardProps) {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "MMM d, yyyy")
    : "Draft";

  return (
    <article className="group relative py-7 transition-colors border-b border-border/60 last:border-b-0">
      <div className="flex flex-col gap-2.5">
        {/* Date and Reading Time */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ""}>
            {formattedDate}
          </time>
          <span className="text-border" aria-hidden="true">•</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Title & Link */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
            <Link href={`/posts/${post.slug}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h2>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-1.5 pt-1">
            {post.tags.map(({ tag }) => (
              <button
                key={tag.slug}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag.slug);
                }}
                className="focus:outline-none"
              >
                <Badge
                  variant="default"
                  size="sm"
                  className="hover:border-accent/40 hover:text-accent cursor-pointer"
                >
                  {tag.name}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
