"use client";

import React, { useState, useRef } from "react";
import { Upload, Check, AlertCircle, Copy, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInserted?: (markdownSnippet: string, url: string) => void;
}

export function ImageUploader({
  isOpen,
  onClose,
  onImageInserted,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setAltText("");
    setIsUploading(false);
    setUploadedUrl(null);
    setErrorMsg(null);
    setCopied(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMsg(null);
      if (!altText) {
        // Derive initial alt text from filename
        const cleanName = selected.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ");
        setAltText(cleanName);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setUploadedUrl(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      setErrorMsg(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInsert = () => {
    if (!uploadedUrl) return;
    const cleanAlt = altText.trim() || "Image";
    const snippet = `![${cleanAlt}](${uploadedUrl})`;
    onImageInserted?.(snippet, uploadedUrl);
    handleClose();
  };

  const handleCopy = async () => {
    if (!uploadedUrl) return;
    const cleanAlt = altText.trim() || "Image";
    const snippet = `![${cleanAlt}](${uploadedUrl})`;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Image"
      description="Upload an image (PNG, JPEG, WebP, GIF, SVG up to 5MB) for this article."
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!uploadedUrl ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-8 text-center cursor-pointer hover:border-accent hover:bg-muted/40 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : "Click to select an image from your computer"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "Supports PNG, JPG, WebP, GIF, SVG up to 5MB"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Alt Text (Description)
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed system architecture diagram"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                disabled={!file}
                isLoading={isUploading}
              >
                Upload Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                <Check className="h-4 w-4" />
                <span>Image uploaded successfully!</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedUrl}
                alt={altText}
                className="max-h-48 w-full rounded-lg object-contain bg-background/50 border border-border"
              />
              <p className="mt-2 font-mono text-[11px] text-muted-foreground truncate">
                {uploadedUrl}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-accent" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleClose}>
                  Done
                </Button>
                {onImageInserted && (
                  <Button variant="primary" size="sm" onClick={handleInsert}>
                    <ImageIcon className="h-3.5 w-3.5 mr-1" />
                    Insert in Editor
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
