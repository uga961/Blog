import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { Globe, Rss } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-md bg-background/85 border-b border-outline-variant/25 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Clean logo icon */}
          <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center">
            <Image
              src="/icon-sm.png"
              alt="Ugandhar Vaddi"
              width={28}
              height={28}
              priority
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground group-hover:underline transition-colors leading-none">
              {siteConfig.name}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant mt-1 leading-none">
              {siteConfig.domain}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Portfolio Link Button */}
          <a
            href={siteConfig.author.social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/50 text-foreground hover:bg-surface-container-high text-xs font-mono transition-all font-medium"
          >
            <Globe className="w-3.5 h-3.5 text-foreground/80" />
            <span>Portfolio</span>
            <span className="text-[10px] opacity-70">↗</span>
          </a>

          {/* RSS Feed Button */}
          <Link
            href="/feed.xml"
            aria-label="RSS Feed"
            title="RSS Feed"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container border border-outline-variant/50 text-foreground hover:bg-surface-container-high text-xs transition-all font-medium"
          >
            <Rss className="w-3.5 h-3.5 text-foreground/80" />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
