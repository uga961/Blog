"use client";

import React, { useState } from "react";
import { Link2, Check, Twitter, Linkedin, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    title
  )}%20${encodeURIComponent(url)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 rounded-full bg-surface-container px-4 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary shadow-xs"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-surface-container px-4 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary shadow-xs"
        title="Share on WhatsApp"
      >
        <MessageCircle  className="h-3.5 w-3.5" />
        <span>Post</span>
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-surface-container px-4 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary shadow-xs"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" />
        <span>Share</span>
      </a>
    </div>
  );
}
