"use client";

import React, { useState } from "react";
import { siteConfig } from "@/lib/config";
import { SocialIcon } from "@/components/ui/SocialIcons";
import confetti from "canvas-confetti";
import {
  MapPin,
  GraduationCap,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

export function HeroBanner({ totalPosts }: { totalPosts: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#dedbc8", "#e1e0cc", "#a2a095"],
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="hero"
      className="relative scroll-mt-28 pt-2 sm:pt-6 pb-2 space-y-6 max-w-4xl"
    >
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 radial-mask pointer-events-none -z-10" />

      <div className="space-y-6">
        {/* Metadata Badges Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40">
            <MapPin className="w-3.5 h-3.5 text-foreground/70" />
            <span>{siteConfig.location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40">
            <GraduationCap className="w-3.5 h-3.5 text-foreground/70" />
            <span>B.E. ECE (9.2 CGPA)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40">
            <BookOpen className="w-3.5 h-3.5 text-foreground/70" />
            <span>{totalPosts} {totalPosts === 1 ? "Essay" : "Essays"} Published</span>
          </span>
        </div>

        {/* Name & Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground font-sans">
            {siteConfig.name}
            <span className="text-foreground/40 font-serif ml-1">*</span>
          </h1>
          <p className="text-base sm:text-xl font-medium text-foreground/90 font-mono">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Bio */}
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl font-sans">
          {siteConfig.bio}
        </p>

        {/* Action Buttons & Socials */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-foreground/90 transition-all duration-200 active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Articles</span>
          </a>

          <a
            href={siteConfig.author.social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-foreground text-xs font-mono shadow-xs hover:bg-white dark:hover:bg-surface-container-highest hover:border-foreground/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
          >
            <SocialIcon name="portfolio" className="w-3.5 h-3.5" />
            <span>Portfolio</span>
            <span className="text-[10px] opacity-70">↗</span>
          </a>

          <button
            onClick={handleCopyEmail}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-foreground text-xs font-mono shadow-xs hover:bg-white dark:hover:bg-surface-container-highest hover:border-foreground/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-foreground/70" />
                <span>Copy Email</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 pl-1">
            {siteConfig.author.social.github && (
              <a
                href={siteConfig.author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface-variant hover:text-foreground hover:bg-white dark:hover:bg-surface-container-highest transition-all duration-200 hover:-translate-y-0.5"
                aria-label="GitHub Profile"
                title="GitHub Profile"
              >
                <SocialIcon name="github" className="w-4 h-4" />
              </a>
            )}
            {siteConfig.author.social.linkedin && (
              <a
                href={siteConfig.author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface-variant hover:text-[#0a66c2] hover:bg-white dark:hover:bg-surface-container-highest transition-all duration-200 hover:-translate-y-0.5"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <SocialIcon name="linkedin" className="w-4 h-4" />
              </a>
            )}
            {siteConfig.author.social.youtube && (
              <a
                href={siteConfig.author.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface-variant hover:text-[#ef4444] hover:bg-white dark:hover:bg-surface-container-highest transition-all duration-200 hover:-translate-y-0.5"
                aria-label="YouTube Channel"
                title="YouTube Channel"
              >
                <SocialIcon name="youtube" className="w-4 h-4" />
              </a>
            )}
            {siteConfig.author.social.reddit && (
              <a
                href={siteConfig.author.social.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface-variant hover:text-[#ff4500] hover:bg-white dark:hover:bg-surface-container-highest transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Reddit Profile"
                title="Reddit Profile"
              >
                <SocialIcon name="reddit" className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
