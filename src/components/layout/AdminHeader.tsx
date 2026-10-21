"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LayoutDashboard, PenLine, ExternalLink, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function AdminHeader({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { error } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        error("Failed to log out");
      }
    } catch {
      error("An error occurred during logout");
    }
  };

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/editor",
      label: "New Post",
      icon: PenLine,
      active: pathname.startsWith("/admin/editor"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/15 text-accent">
              A
            </span>
            <span>Admin</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-border/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="View Live Public Blog"
          >
            <span className="hidden sm:inline">View Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <ThemeToggle />

          {userName && (
            <span className="hidden text-xs text-muted-foreground md:inline-block">
              {userName}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-border/70 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 hover:border-red-500/30 dark:text-red-400 transition-colors"
            title="Log out of admin"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
