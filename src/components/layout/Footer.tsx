import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Github, Twitter, Linkedin, Rss, Youtube, Globe } from "lucide-react";
import { FaRedditAlien } from "react-icons/fa";
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-outline-variant/40 bg-surface-container/50 py-12 text-xs text-on-surface-variant transition-colors">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start text-center sm:text-left">
          <p className="font-medium text-on-surface" suppressHydrationWarning>
            © {currentYear} {siteConfig.name}
          </p>
          <p className="text-[12px] text-on-surface-variant/80">
            Thoughts, engineering essays & creative notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {siteConfig.author.social.website && (
            <a
              href={siteConfig.author.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:text-foreground hover:-translate-y-0.5 hover:shadow-xs"
              aria-label="Main Portfolio Website"
              title="Portfolio Website"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.github && (
            <a
              href={siteConfig.author.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:-translate-y-0.5 hover:shadow-xs"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.youtube && (
            <a
              href={siteConfig.author.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:text-[#ef4444] hover:-translate-y-0.5 hover:shadow-xs"
              aria-label="YouTube Profile"
            >
              <Youtube className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.reddit && (
            <a
              href={siteConfig.author.social.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:text-[#ff4500] hover:-translate-y-0.5 hover:shadow-xs"
              aria-label="Reddit Profile"
            >
              <FaRedditAlien className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.linkedin && (
            <a
              href={siteConfig.author.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:text-[#0a66c2] hover:-translate-y-0.5 hover:shadow-xs"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          <Link
            href="/feed.xml"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-highest hover:text-on-surface hover:-translate-y-0.5 hover:shadow-xs"
            aria-label="RSS Feed"
            title="RSS Feed"
          >
            <Rss className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
