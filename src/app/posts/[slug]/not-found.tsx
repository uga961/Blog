import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pt-28 pb-20 text-center sm:px-6">
        <div className="rounded-[4px] border border-border/80 bg-surface/60 p-8 sm:p-10 max-w-md w-full flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[3px] border border-border/80 bg-surface text-foreground mb-1">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant block">
              ERROR 404 · ARTICLE NOT FOUND
            </span>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Article Not Located
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
            The essay you are looking for does not exist or the filename was changed in the <code className="font-mono text-foreground px-1 py-0.5 rounded-[2px] bg-surface-subtle border border-border/80">/posts</code> directory.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[4px] bg-foreground px-4 py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-background hover:bg-foreground/90 transition-colors touch-manipulation min-h-[40px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Index</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
