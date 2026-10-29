"use client";

import React, { useState, useMemo } from "react";
import { ArticleCard } from "./ArticleCard";
import { Post, PostSummary } from "@/lib/posts";
import { Search, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface ArticleListProps {
  posts: (Post | PostSummary)[];
  postsPerPage?: number;
}

export function ArticleList({
  posts,
  postsPerPage = 6,
}: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return posts;

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface-variant/70" />
        <input
          type="text"
          placeholder="Search articles by title, topic, or keyword…"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="h-10 w-full rounded-[4px] border border-border/80 bg-surface/80 pl-9 pr-9 text-xs font-mono text-foreground placeholder:text-on-surface-variant/60 focus:border-foreground focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Editorial List of Essays */}
      {paginatedPosts.length > 0 ? (
        <div className="divide-y divide-border/80 border-t border-b border-border/80">
          {paginatedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[4px] border border-border/80 bg-surface/40 py-16 text-center space-y-2">
          <BookOpen className="h-8 w-8 text-on-surface-variant/40 mb-1" />
          <h3 className="text-sm font-mono font-semibold uppercase text-foreground">
            No matching entries found
          </h3>
          <p className="text-xs text-on-surface-variant font-sans max-w-sm">
            No articles match the current search query.
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-2 text-xs font-mono underline text-foreground hover:opacity-80 cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs font-mono text-on-surface-variant">
          <span>
            Page {currentPage} of {totalPages} ({filteredPosts.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-[3px] border border-border/80 bg-surface px-3 py-1.5 font-medium text-foreground hover:border-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-[3px] border border-border/80 bg-surface px-3 py-1.5 font-medium text-foreground hover:border-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
