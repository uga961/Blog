import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function ArticleNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pt-28 pb-20 text-center sm:px-6">
        <SpotlightCard className="p-10 max-w-md w-full flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container border border-outline-variant/40 text-foreground mb-4">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Article Not Found
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            The article you are looking for does not exist or the filename was changed in the <code>/posts</code> directory.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-xs font-mono font-semibold text-background hover:bg-foreground/90 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </SpotlightCard>
      </main>

      <Footer />
    </div>
  );
}
