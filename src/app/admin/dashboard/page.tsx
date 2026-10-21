import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { DashboardClient } from "./DashboardClient";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  // Fetch initial posts and stats
  const [posts, totalCount, publishedCount, draftCount, scheduledCount] =
    await Promise.all([
      prisma.post.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          tags: {
            include: { tag: true },
          },
        },
      }),
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
    ]);

  const initialStats = {
    total: totalCount,
    published: publishedCount,
    draft: draftCount,
    scheduled: scheduledCount,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader userName={session.name} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <DashboardClient initialPosts={posts} initialStats={initialStats} />
      </main>
    </div>
  );
}
