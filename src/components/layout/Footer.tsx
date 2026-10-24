"use client";

import React from "react";
import { Mail, ArrowUp, Globe, Clock, Sparkles } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/lib/config";
import { SocialIcon } from "@/components/ui/SocialIcons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { name: "Portfolio", url: siteConfig.author.social.website },
    { name: "GitHub", url: siteConfig.author.social.github },
    { name: "LinkedIn", url: siteConfig.author.social.linkedin },
    { name: "YouTube", url: siteConfig.author.social.youtube },
    { name: "Reddit", url: siteConfig.author.social.reddit },
    { name: "RSS", url: "/feed.xml" },
  ];

  return (
    <footer id="contact" className="scroll-mt-28 pt-20 pb-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      <SpotlightCard className="p-8 sm:p-12 text-center space-y-6 border-outline-variant/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-xs font-mono text-foreground font-semibold">
          <Mail className="w-3.5 h-3.5 text-foreground/70" />
          <span>Get in Touch</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground max-w-xl mx-auto">
          Let&apos;s build something solid.
        </h2>

        <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed">
          Whether you want to discuss technology, research insights, data science, resilient systems, or collaborative opportunities — my inbox is always open.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm shadow-xs hover:shadow-lg hover:-translate-y-0.5 hover:bg-foreground/90 transition-all duration-200 active:scale-95 active:translate-y-0"
          >
            <Mail className="w-4 h-4" />
            <span>Send an Email</span>
          </a>

          {siteConfig.author.social.linkedin && (
            <a
              href={siteConfig.author.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-foreground text-sm font-mono shadow-xs hover:bg-white dark:hover:bg-surface-container-highest hover:border-foreground/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:translate-y-0"
            >
              <FaLinkedin className="w-4 h-4 text-[#0a66c2]" aria-hidden="true" />
              <span>Connect on LinkedIn</span>
            </a>
          )}
        </div>

        <div className="pt-8 border-t border-outline-variant/20 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-foreground/70" />
            {siteConfig.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-foreground/70" />
            Indian Standard Time (UTC+5:30)
          </span>
        </div>
      </SpotlightCard>

      {/* Bottom bar with socials and copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-outline-variant/20 text-xs font-mono text-on-surface-variant">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          {socials.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.name === "RSS" ? undefined : "_blank"}
              rel={link.name === "RSS" ? undefined : "noopener noreferrer"}
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <SocialIcon name={link.name} className="w-3.5 h-3.5" />
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span suppressHydrationWarning>
            &copy; {currentYear} Ugandhar Vaddi. Build, Ship and Sleep.
          </span>
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-foreground transition-colors border border-outline-variant/30"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
