import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Github, Twitter, Linkedin, Rss, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container-low/50 py-12 text-xs text-on-surface-variant transition-colors">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start text-center sm:text-left">
          <p className="font-medium text-on-surface">© {currentYear} {siteConfig.name}</p>
          <p className="text-[12px] text-on-surface-variant/80">
            Thoughts, engineering essays & creative notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {siteConfig.author.social.github && (
            <a
              href={siteConfig.author.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
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
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              aria-label="YouTube Profile"
            >
              <Youtube className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.linkedin && (
            <a
              href={siteConfig.author.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          <Link
            href="/feed.xml"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
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
