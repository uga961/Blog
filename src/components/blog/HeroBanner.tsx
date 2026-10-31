"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Copy, Check, Globe } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function HeroBanner({ totalPosts }: { totalPosts: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const socials = [
    { name: "Portfolio", url: "https://www.ugandhar.in" },
    { name: "GitHub", url: siteConfig.author.social.github },
    { name: "LinkedIn", url: siteConfig.author.social.linkedin },
    { name: "YouTube", url: siteConfig.author.social.youtube },
    { name: "Reddit", url: siteConfig.author.social.reddit },
    { name: "RSS", url: "/feed.xml" },
  ];

  return (
    <section
      id="hero"
      className="w-full pt-24 sm:pt-36 pb-16 sm:pb-20 overflow-hidden"
    >
      {/* Top Editorial Index Bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3 text-xs font-mono text-on-surface-variant">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <span className="text-foreground font-semibold uppercase tracking-wider flex-shrink-0">
            INDEX 001
          </span>
          <span className="text-border flex-shrink-0">/</span>
          <span className="truncate">PERSONAL BLOG &amp; NOTES</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span>
            B.E. ECE · {totalPosts} {totalPosts === 1 ? "ESSAY" : "ESSAYS"} PUBLISHED
          </span>
        </div>
      </div>

      {/* Main Grid: Typography & Author Portrait */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 pt-8 sm:pt-12 items-start">
        {/* Left Column: Title, Tagline, Bio, Actions */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7">
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-sans uppercase break-words">
              {siteConfig.name}
            </h1>
            <p className="mt-2.5 sm:mt-3 text-base sm:text-xl font-serif italic text-foreground/80 leading-snug">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans max-w-xl">
            <p>{siteConfig.bio}</p>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
            <a
              href="#articles"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-[4px] bg-foreground text-background font-medium text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors touch-manipulation min-h-[40px]"
            >
              <span>Read Articles</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://www.ugandhar.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-border/90 bg-surface/80 text-foreground font-mono text-xs hover:border-foreground transition-colors touch-manipulation min-h-[40px]"
            >
              <Globe className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-on-surface-variant" />
            </a>

            <button
              onClick={handleCopyEmail}
              title="Copy direct email address"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-border/90 bg-surface/80 text-foreground font-mono text-xs hover:border-foreground transition-colors touch-manipulation min-h-[40px] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-foreground" />
                  <span className="text-foreground font-semibold">Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Clean slash-separated text links */}
          <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs font-mono text-on-surface-variant">
            {socials.map((link, idx) => (
              <React.Fragment key={link.name}>
                <a
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hover:text-foreground hover:underline transition-colors flex items-center gap-1 touch-manipulation"
                >
                  <span>{link.name}</span>
                  {link.url.startsWith("http") && (
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  )}
                </a>
                {idx < socials.length - 1 && (
                  <span className="text-border select-none">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Column: Author Portrait */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
          <div className="w-full max-w-[280px] sm:max-w-sm border border-border bg-surface p-2.5 sm:p-3 rounded-[4px] shadow-subtle">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container rounded-[2px]">
              <Image
                src="/avatar/profile.jpg"
                alt="Portrait of Ugandhar Vaddi"
                fill
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 380px"
                className="object-cover transition-all duration-500 ease-out"
              />
            </div>
            <div className="mt-2.5 sm:mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-on-surface-variant">
              <span>FIG. 01 — AUTHOR</span>
              <span className="text-foreground/90 font-medium">UGANDHAR VADDI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
