import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Rss, Globe, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant/30 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          {/* Brand Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/Logo.png"
              alt="Ugandhar Vaddi"
              width={40}
              height={40}
              sizes="40px"
              quality={85}
              className="h-full w-full object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-on-surface">
              {siteConfig.name}
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Personal Journal</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {siteConfig.author.social.website && (
            <a
              href={siteConfig.author.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-3.5 sm:px-4 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-high hover:-translate-y-0.5 hover:shadow-xs"
              title="Visit Portfolio"
              aria-label="Visit Main Portfolio Website"
            >
              <Globe className="h-4 w-4 text-on-surface-variant" />
              <span className="tracking-tight">Portfolio</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-on-surface-variant/70" />
            </a>
          )}
          <Link
            href="/feed.xml"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all duration-200 hover:bg-white dark:hover:bg-surface-container-high hover:text-on-surface hover:-translate-y-0.5 hover:shadow-xs"
            title="RSS Feed"
            aria-label="RSS Feed"
          >
            <Rss className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
