import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { ArrowUpRight, Rss } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-background/95 sm:bg-background/90 sm:backdrop-blur-md border-b border-border/80 transition-colors gpu-layer">
      <div className="w-full max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group touch-manipulation">
          <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
            <Image
              src="/icon-sm.png"
              alt="Ugandhar Vaddi"
              width={24}
              height={24}
              priority
              className="w-full h-full object-contain rounded-[2px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider uppercase text-foreground group-hover:underline leading-none">
              {siteConfig.name}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant mt-0.5 leading-none">
              {siteConfig.domain}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Navigation"
          className="hidden md:flex items-center gap-5 text-xs font-mono text-on-surface-variant"
        >
          <Link
            href="/#articles"
            className="hover:text-foreground hover:underline transition-colors touch-manipulation"
          >
            Articles
          </Link>
          <Link
            href="/#activity"
            className="hover:text-foreground hover:underline transition-colors touch-manipulation"
          >
            Activity
          </Link>
          <Link
            href="/#contact"
            className="hover:text-foreground hover:underline transition-colors touch-manipulation"
          >
            Contact
          </Link>
          <div className="w-[1px] h-3.5 bg-border/80 flex-shrink-0" />
          <a
            href="https://www.ugandhar.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-semibold hover:underline transition-colors flex items-center gap-0.5 touch-manipulation"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <Link
            href="/feed.xml"
            aria-label="RSS Feed"
            title="RSS Feed"
            className="text-on-surface-variant hover:text-foreground transition-colors flex items-center gap-1 touch-manipulation"
          >
            <Rss className="w-3 h-3" />
            <span>RSS</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
