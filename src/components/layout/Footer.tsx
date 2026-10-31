"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowUpRight, Copy, Check, Globe, Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();

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
    <footer
      id="contact"
      className="pt-20 pb-28 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 overflow-hidden"
    >
      {/* Editorial Contact Block */}
      <div className="border-t border-border/80 pt-8 sm:pt-10 space-y-6">
        <div className="border-b border-border/80 pb-3 text-xs font-mono text-on-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="text-foreground font-semibold uppercase tracking-wider flex-shrink-0">
              INDEX 005
            </span>
            <span className="text-border flex-shrink-0">/</span>
            <span className="truncate">GET IN TOUCH</span>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant flex-shrink-0">
            INBOX OPEN
          </span>
        </div>

        <div className="max-w-2xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans uppercase break-words">
            Let&apos;s build something solid.
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">
            Whether you want to discuss technology, research insights, data science, resilient systems, or collaborative opportunities &mdash; my inbox is always open.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-[4px] bg-foreground text-background font-medium text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors touch-manipulation min-h-[40px]"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send an Email</span>
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
                <FaLinkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-on-surface-variant" />
              </a>
            )}
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
          <span suppressHydrationWarning>
            &copy; {currentYear} Ugandhar Vaddi. Build, Ship and Sleep.
          </span>
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
