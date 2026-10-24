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
    if (searchQuery.trim() === "") return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        post.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [posts, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  return (
    <div className="w-full space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/70" />
        <input
          type="text"
          placeholder="Search articles by title, topic, or keyword…"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="h-12 w-full rounded-2xl border border-outline-variant/40 bg-surface-container/70 pl-11 pr-10 text-sm text-foreground placeholder:text-on-surface-variant/60 focus:border-foreground/40 focus:bg-white dark:focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-outline-variant/30 transition-all shadow-[var(--card-shadow)]"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Article Cards Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant/50 bg-surface-container-low/50 py-16 text-center">
          <BookOpen className="h-10 w-10 text-on-surface-variant/40 mb-3" />
          <h3 className="text-base font-semibold text-on-surface">
            No matching articles
          </h3>
          <p className="mt-1 text-xs text-on-surface-variant max-w-sm">
            We couldn&apos;t find any articles matching your search query.
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-4 text-xs font-mono font-semibold text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6 text-xs font-mono text-on-surface-variant">
          <span>
            Page {currentPage} of {totalPages} ({filteredPosts.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-2 font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-2 font-medium text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
