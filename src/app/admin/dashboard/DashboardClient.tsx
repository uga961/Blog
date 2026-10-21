"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/components/ui/Toast";
import {
  PenLine,
  Eye,
  Trash2,
  Search,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  Archive,
  ArrowUpDown,
} from "lucide-react";

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: Date | string | null;
  updatedAt: Date | string;
  readingTime: number;
  tags?: { tag: { name: string; slug: string } }[];
}

interface DashboardClientProps {
  initialPosts: PostRow[];
  initialStats: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
  };
}

export function DashboardClient({
  initialPosts,
  initialStats,
}: DashboardClientProps) {
  const [posts, setPosts] = useState<PostRow[]>(initialPosts);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { success, error } = useToast();

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/posts/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        published:
          deleteTarget.status === "PUBLISHED"
            ? prev.published - 1
            : prev.published,
        draft:
          deleteTarget.status === "DRAFT" ? prev.draft - 1 : prev.draft,
        scheduled:
          deleteTarget.status === "SCHEDULED"
            ? prev.scheduled - 1
            : prev.scheduled,
      }));

      success("Post deleted successfully");
      setDeleteTarget(null);
    } catch {
      error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (post: PostRow) => {
    const nextStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          content: "dummy-fetch-current", // Will be preserved if we fetch or just send partial
          status: nextStatus,
          publishedAt: nextStatus === "PUBLISHED" ? new Date().toISOString() : null,
        }),
      });

      if (!res.ok) {
        // Fetch full post to update properly
        const fullRes = await fetch(`/api/admin/posts/${post.id}`);
        const fullData = await fullRes.json();
        if (fullData.post) {
          await fetch(`/api/admin/posts/${post.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: fullData.post.title,
              slug: fullData.post.slug,
              excerpt: fullData.post.excerpt,
              content: fullData.post.content,
              coverImage: fullData.post.coverImage,
              status: nextStatus,
              publishedAt: nextStatus === "PUBLISHED" ? new Date().toISOString() : null,
              tags: fullData.post.tags?.map((t: { tag: { name: string } }) => t.tag.name) || [],
            }),
          });
        }
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                status: nextStatus,
                publishedAt: nextStatus === "PUBLISHED" ? new Date() : null,
              }
            : p
        )
      );

      setStats((prev) => ({
        ...prev,
        published:
          nextStatus === "PUBLISHED" ? prev.published + 1 : prev.published - 1,
        draft:
          nextStatus === "DRAFT" ? prev.draft + 1 : prev.draft - 1,
      }));

      success(
        nextStatus === "PUBLISHED"
          ? "Post published to live site"
          : "Post reverted to draft"
      );
    } catch {
      error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar: Title & New Post button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Articles Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee drafts, publication dates, and live articles.
          </p>
        </div>

        <Link href="/admin/editor">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4 mr-1" />
            <span>Create Article</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
            statusFilter === "ALL"
              ? "border-accent bg-accent/5 ring-1 ring-accent"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total Posts
            </span>
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground">
            {stats.total}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("PUBLISHED")}
          className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
            statusFilter === "PUBLISHED"
              ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">
              Published
            </span>
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground">
            {stats.published}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("DRAFT")}
          className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
            statusFilter === "DRAFT"
              ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">
              Drafts
            </span>
            <Archive className="h-4 w-4" />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground">
            {stats.draft}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("SCHEDULED")}
          className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
            statusFilter === "SCHEDULED"
              ? "border-sky-500 bg-sky-500/5 ring-1 ring-sky-500"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">
              Scheduled
            </span>
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground">
            {stats.scheduled}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {["ALL", "PUBLISHED", "DRAFT", "SCHEDULED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                statusFilter === status
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/70 bg-muted/30 font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Title & Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Published Date</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPosts.map((post) => {
                  const pubDate = post.publishedAt
                    ? format(new Date(post.publishedAt), "MMM d, yyyy")
                    : "—";
                  const updatedDate = format(
                    new Date(post.updatedAt),
                    "MMM d, yyyy"
                  );

                  return (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground text-sm max-w-sm sm:max-w-md truncate">
                          {post.title}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground/70 truncate mt-0.5">
                          /posts/{post.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={
                            post.status === "PUBLISHED"
                              ? "published"
                              : post.status === "SCHEDULED"
                              ? "scheduled"
                              : "draft"
                          }
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {pubDate}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {updatedDate}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Link */}
                          <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="View / Preview Post"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          {/* Quick Publish Toggle */}
                          <button
                            onClick={() => handleToggleStatus(post)}
                            className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                              post.status === "PUBLISHED"
                                ? "border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                                : "border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            title={
                              post.status === "PUBLISHED"
                                ? "Revert to draft"
                                : "Publish post"
                            }
                          >
                            {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </button>

                          {/* Edit Button */}
                          <Link
                            href={`/admin/editor/${post.id}`}
                            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Edit Post"
                          >
                            <PenLine className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="rounded p-1.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">
              No articles found
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {search
                ? `No articles match "${search}". Try clearing search.`
                : "You haven't created any articles yet."}
            </p>
            <Link href="/admin/editor" className="mt-4">
              <Button variant="primary" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Write Your First Article</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
