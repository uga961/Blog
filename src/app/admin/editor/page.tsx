import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function CreatePostPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader userName={session.name} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <PostForm isEditing={false} />
      </main>
    </div>
  );
}
