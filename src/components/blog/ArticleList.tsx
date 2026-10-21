"use client";

import React, { useState, useMemo } from "react";
import { ArticleCard } from "./ArticleCard";
import { Search, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  publishedAt: Date | string | null;
  readingTime: number;
  tags?: { tag: { name: string; slug: string } }[];
}

interface ArticleListProps {
  posts: PostItem[];
  allTags: { name: string; slug: string; count: number }[];
  postsPerPage?: number;
}

export function ArticleList({
  posts,
  allTags,
  postsPerPage = 6,
}: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt &&
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        !selectedTag ||
        post.tags?.some((t) => t.tag.slug === selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const handleTagSelect = (tagSlug: string) => {
    setSelectedTag((prev) => (prev === tagSlug ? null : tagSlug));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-8">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search articles by title, topic, or keyword…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl border border-border/80 bg-background pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => {
                setSelectedTag(null);
                setCurrentPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedTag === null
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "border border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Articles ({posts.length})
            </button>

            {allTags.map((t) => {
              const isSelected = selectedTag === t.slug;
              return (
                <button
                  key={t.slug}
                  onClick={() => handleTagSelect(t.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "border border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t.name} ({t.count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Article List or Empty State */}
      {paginatedPosts.length > 0 ? (
        <div className="divide-y divide-border/60">
          {paginatedPosts.map((post) => (
            <ArticleCard
              key={post.id}
              post={post}
              onTagClick={handleTagSelect}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 py-16 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold text-foreground">
            No articles found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {searchQuery || selectedTag
              ? "We couldn't find any articles matching your search filters."
              : "No published articles yet. Check back soon!"}
          </p>
          {(searchQuery || selectedTag) && (
            <button
              onClick={resetFilters}
              className="mt-4 text-xs font-medium text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages} ({filteredPosts.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-border/80 px-3 py-1.5 font-medium transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-border/80 px-3 py-1.5 font-medium transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
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
