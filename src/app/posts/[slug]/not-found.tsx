import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container p-10 shadow-sm max-w-md w-full flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-primary-on-container mb-4">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface">
            Article Not Found
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            The article you are looking for does not exist or the filename was changed in the <code>/posts</code> directory.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
