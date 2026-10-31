import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface relative selection:bg-foreground/15 selection:text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 pt-36 pb-20 flex flex-col justify-center items-start space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant border-b border-border/80 pb-3 w-full">
          <span className="text-foreground font-semibold uppercase tracking-wider">
            INDEX 404
          </span>
          <span className="text-border">/</span>
          <span>PAGE NOT FOUND</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground">
            Entry Not In Archive
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant font-sans max-w-lg leading-relaxed">
            The article, note, or resource you are looking for has been relocated or does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[4px] bg-foreground px-4 py-2.5 text-xs font-mono font-medium text-background transition-colors hover:bg-foreground/90 uppercase tracking-wider touch-manipulation cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
