import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Github, Twitter, Linkedin, Rss, Lock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 py-10 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="text-[11px] text-muted-foreground/80">
            Handcrafted with Next.js, TypeScript & Tailwind CSS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {siteConfig.author.social.github && (
            <a
              href={siteConfig.author.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-colors hover:text-foreground"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.twitter && (
            <a
              href={siteConfig.author.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-colors hover:text-foreground"
              aria-label="Twitter Profile"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.linkedin && (
            <a
              href={siteConfig.author.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-colors hover:text-foreground"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          <Link
            href="/feed.xml"
            className="p-1.5 transition-colors hover:text-foreground"
            aria-label="RSS Feed"
          >
            <Rss className="h-4 w-4" />
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/admin"
            className="flex items-center gap-1 p-1.5 font-medium transition-colors hover:text-foreground"
            title="Admin Login"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
