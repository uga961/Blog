"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowUpRight, Copy, Check, Globe } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <footer id="contact" className="pt-20 pb-28 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 overflow-hidden">
      {/* Editorial Contact Block */}
      <div className="border-t border-border/80 pt-8 sm:pt-10 space-y-8">
        <div className="border-b border-border/80 pb-4 text-xs font-mono text-on-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="text-foreground font-semibold uppercase tracking-wider flex-shrink-0">INDEX 005</span>
            <span className="text-border flex-shrink-0">/</span>
            <span className="truncate">CORRESPONDENCE &amp; CONTACT</span>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant flex-shrink-0">
            UTC+5:30 · IST
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans uppercase break-words">
              Let&apos;s build something solid.
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans max-w-lg">
              Whether you want to discuss VLSI hardware, SRAM stability, enterprise data intelligence pipelines, open-source desktop tooling, or collaborative research &mdash; my inbox is always open.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-[4px] bg-foreground text-background font-medium text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors touch-manipulation min-h-[40px]"
              >
                <span>Write Email</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-border/90 bg-surface/80 text-foreground font-mono text-xs hover:border-foreground transition-colors cursor-pointer touch-manipulation min-h-[40px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-foreground" />
                    <span className="text-foreground font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

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

              {siteConfig.author.social.linkedin && (
                <a
                  href={siteConfig.author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-border/90 bg-surface/80 text-foreground font-mono text-xs hover:border-foreground transition-colors touch-manipulation min-h-[40px]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-on-surface-variant" />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-5 space-y-3 text-xs font-mono text-on-surface-variant border-l-0 md:border-l md:border-border/60 md:pl-8">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-foreground/70 font-semibold block">
                Primary Coordinates
              </span>
              <div className="text-foreground break-words">{siteConfig.email}</div>
              <div className="break-words">{siteConfig.location}</div>
            </div>

            <div className="pt-2 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-foreground/70 font-semibold block">
                Availability
              </span>
              <div className="break-words">Associate Data Scientist at Tredence (Nov 2026)</div>
              <div className="break-words">Open for technical discourse &amp; research dialogues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiet Bottom Bar */}
      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-on-surface-variant">
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
          {socials.map((link, idx) => (
            <React.Fragment key={link.name}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="hover:text-foreground hover:underline transition-colors touch-manipulation"
              >
                {link.name}
              </a>
              {idx < socials.length - 1 && (
                <span className="text-border select-none">/</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Ugandhar Vaddi.</span>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-1.5 rounded-[2px] border border-border/80 hover:border-foreground text-on-surface-variant hover:text-foreground transition-colors cursor-pointer touch-manipulation"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
