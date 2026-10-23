import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Rss, Sparkles } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant/25 bg-surface/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          {/* M3 Tonal Avatar */}
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-container text-primary-on-container font-mono text-sm font-bold shadow-xs transition-transform group-hover:scale-105">
            {siteConfig.author.initials}
          </div> */}

          {/* Brand Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-container">
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
            <span className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1">
              
              <span>Personal Journal</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/feed.xml"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
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
