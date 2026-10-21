import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PostForm } from "@/components/admin/PostForm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post) {
    redirect("/admin/dashboard");
  }

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    content: post.content,
    coverImage: post.coverImage || "",
    status: post.status,
    publishedAt: post.publishedAt?.toISOString(),
    tags: post.tags.map((t) => t.tag.name),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader userName={session.name} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <PostForm initialData={initialData} isEditing={true} />
      </main>
    </div>
  );
}
