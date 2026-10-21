"use client";

import React, { useState, useMemo } from "react";
import { ArticleCard } from "./ArticleCard";
import { Post } from "@/lib/posts";
import { Search, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ArticleListProps {
  posts: Post[];
  allTags: { name: string; count: number }[];
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
        !selectedTag || post.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const handleTagSelect = (tagName: string) => {
    setSelectedTag((prev) => (prev === tagName ? null : tagName));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-8">
      {/* Material 3 Search & Filters */}
      <div className="space-y-4">
        {/* M3 Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/70" />
          <input
            type="text"
            placeholder="Search articles, topics, keywords…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-12 w-full rounded-full border border-outline-variant/40 bg-surface-container pl-11 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
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

        {/* M3 Filter Chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedTag(null);
                setCurrentPage(1);
              }}
              className="focus:outline-none"
            >
              <Badge active={selectedTag === null}>
                All Posts ({posts.length})
              </Badge>
            </button>

            {allTags.map((t) => (
              <button
                key={t.name}
                onClick={() => handleTagSelect(t.name)}
                className="focus:outline-none"
              >
                <Badge active={selectedTag === t.name}>
                  {t.name} ({t.count})
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article Cards Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedPosts.map((post) => (
            <ArticleCard
              key={post.id}
              post={post}
              onTagClick={handleTagSelect}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant/50 bg-surface-container-low/50 py-16 text-center">
          <BookOpen className="h-10 w-10 text-on-surface-variant/40 mb-3" />
          <h3 className="text-base font-semibold text-on-surface">
            No matching articles
          </h3>
          <p className="mt-1 text-xs text-on-surface-variant max-w-sm">
            {searchQuery || selectedTag
              ? "We couldn't find any articles matching your search query or tag."
              : "No articles found in /posts. Create one using template.md!"}
          </p>
          {(searchQuery || selectedTag) && (
            <button
              onClick={resetFilters}
              className="mt-4 text-xs font-semibold text-primary hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      {/* M3 Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-6 text-xs text-on-surface-variant">
          <span>
            Page {currentPage} of {totalPages} ({filteredPosts.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-full bg-surface-container px-4 py-2 font-medium text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-full bg-surface-container px-4 py-2 font-medium text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-40 disabled:pointer-events-none"
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
