"use client";

import React, { useState } from "react";
import { Link2, Check, MessageCircle } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";

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
        className="flex items-center gap-1.5 rounded-[3px] border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-mono font-medium text-foreground transition-colors hover:border-foreground cursor-pointer touch-manipulation"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-foreground" />
            <span className="font-semibold text-foreground">Copied</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5 text-on-surface-variant" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-[3px] border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-mono font-medium text-foreground transition-colors hover:border-foreground touch-manipulation"
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-3.5 w-3.5 text-on-surface-variant" />
        <span>WhatsApp</span>
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-[3px] border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-mono font-medium text-foreground transition-colors hover:border-foreground touch-manipulation"
        title="Share on LinkedIn"
      >
        <FaLinkedin className="h-3.5 w-3.5 text-on-surface-variant" />
        <span>LinkedIn</span>
      </a>
    </div>
  );
}
