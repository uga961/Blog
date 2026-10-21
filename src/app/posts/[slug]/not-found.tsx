import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <div className="rounded-2xl border border-border/80 bg-card p-10 shadow-sm max-w-md w-full flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
            <FileQuestion className="h-6 w-6" />
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Article Not Found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            The article you are looking for doesn&apos;t exist, has been moved, or is still an unpublished draft.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors shadow-sm"
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
