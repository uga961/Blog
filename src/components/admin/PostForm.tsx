"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  AlertCircle,
  Save,
  CheckCircle,
} from "lucide-react";

export interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt?: string;
  tags: string[]; // tag names
}

interface PostFormProps {
  initialData?: PostFormData;
  isEditing?: boolean;
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">(
    initialData?.status || "DRAFT"
  );
  const [publishedAt, setPublishedAt] = useState<string>(() => {
    if (initialData?.publishedAt) {
      const d = new Date(initialData.publishedAt);
      return d.toISOString().slice(0, 16);
    }
    return new Date().toISOString().slice(0, 16);
  });
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );

  const [editorTab, setEditorTab] = useState<"write" | "preview" | "split">(
    "write"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-slug generation from title unless user edited slug manually
  useEffect(() => {
    if (!isSlugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugManual]);

  // Track unsaved changes
  useEffect(() => {
    setIsDirty(true);
  }, [title, slug, excerpt, content, coverImage, status, publishedAt, tagsInput]);

  // Warn on page unload if changes are unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Formatting helpers
  const insertFormatting = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    const replacement = `${before}${selectedText}${after}`;
    const newContent =
      content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleImageInserted = (markdownSnippet: string) => {
    insertFormatting(markdownSnippet, "");
  };

  const handleSubmit = async (targetStatus?: "DRAFT" | "PUBLISHED" | "SCHEDULED") => {
    if (!title.trim()) {
      error("Title is required");
      return;
    }
    if (!content.trim()) {
      error("Article content is required");
      return;
    }

    const currentTargetStatus = targetStatus || status;

    setIsSaving(true);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim() || undefined,
      content,
      coverImage: coverImage.trim() || undefined,
      status: currentTargetStatus,
      publishedAt:
        currentTargetStatus === "PUBLISHED" || currentTargetStatus === "SCHEDULED"
          ? new Date(publishedAt).toISOString()
          : null,
      tags: parsedTags,
    };

    try {
      const url = isEditing
        ? `/api/admin/posts/${initialData?.id}`
        : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setIsDirty(false);
      success(
        currentTargetStatus === "PUBLISHED"
          ? "Post published successfully!"
          : "Post draft saved successfully!"
      );

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving post";
      error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-tight">
            {isEditing ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEditing
              ? "Modify post content, metadata, and publication status."
              : "Draft your thoughts in Markdown with live preview."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/dashboard")}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSubmit(status === "DRAFT" ? "PUBLISHED" : status)}
            isLoading={isSaving}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            {status === "PUBLISHED"
              ? "Update Post"
              : status === "SCHEDULED"
              ? "Schedule Post"
              : "Publish Now"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Article Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Architecting Distributed Systems with Zero-Trust Security"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-xl border border-border/90 bg-background px-4 font-serif text-lg sm:text-xl font-semibold text-foreground placeholder:text-muted-foreground/60 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Subtitle / Excerpt
            </label>
            <textarea
              rows={2}
              placeholder="A brief overview or hook for readers and social cards..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Markdown Editor / Preview Area */}
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/40 p-2 text-xs">
              {/* Formatting buttons */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => insertFormatting("**", "**", "bold text")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("*", "*", "italic text")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n## ", "\n", "Heading 2")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n### ", "\n", "Heading 3")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n> ", "\n", "Quote")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Blockquote"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("`", "`", "code")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Inline Code"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n- ", "\n", "List item")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Unordered List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("[", "](https://example.com)", "link title")}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Insert Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="flex items-center gap-1 rounded bg-accent/10 px-2 py-1 text-accent font-medium hover:bg-accent/20"
                  title="Upload & Insert Image"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Image</span>
                </button>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center rounded-lg border border-border/60 bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
                    editorTab === "write"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
                    editorTab === "preview"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("split")}
                  className={`hidden sm:flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
                    editorTab === "split"
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>Split</span>
                </button>
              </div>
            </div>

            {/* Editor Textarea / Preview pane */}
            <div className="relative">
              {editorTab === "write" && (
                <textarea
                  ref={textareaRef}
                  rows={20}
                  placeholder="Write your article in Markdown... (GFM supported)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-background p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-y"
                />
              )}

              {editorTab === "preview" && (
                <div className="min-h-[480px] p-6 bg-background">
                  {content.trim() ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Nothing to preview yet. Start typing in the Write tab!
                    </p>
                  )}
                </div>
              )}

              {editorTab === "split" && (
                <div className="grid grid-cols-2 divide-x divide-border">
                  <textarea
                    ref={textareaRef}
                    rows={22}
                    placeholder="Write article in Markdown..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-background p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none"
                  />
                  <div className="p-4 overflow-y-auto max-h-[550px] bg-background">
                    {content.trim() ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        Preview appears here...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings Area (1 col on lg) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-5 shadow-sm">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Publishing & Metadata
            </h2>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "SCHEDULED")
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="DRAFT">Draft (Private)</option>
                <option value="PUBLISHED">Published (Public)</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>

            {/* Published / Scheduled Date */}
            {(status === "PUBLISHED" || status === "SCHEDULED") && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  {status === "SCHEDULED" ? "Scheduled Release Date" : "Publish Date"}
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-[11px] text-accent hover:underline"
                >
                  {isSlugManual ? "Auto-generate" : "Custom"}
                </button>
              </div>
              <div className="flex items-center rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
                <span className="text-xs select-none">/posts/</span>
                <input
                  type="text"
                  value={slug}
                  disabled={!isSlugManual}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  className="h-9 w-full bg-transparent pl-1 font-mono text-xs text-foreground focus:outline-none disabled:opacity-75"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="architecture, nextjs, systems"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Cover Image URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or /uploads/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImageModalOpen(true)}
                  title="Upload Cover"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              {coverImage && (
                <div className="mt-2 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-28 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Uploader Modal */}
      <ImageUploader
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageInserted={(snippet, url) => {
          if (!coverImage) {
            setCoverImage(url);
          }
          handleImageInserted(snippet);
        }}
      />
    </div>
  );
}
