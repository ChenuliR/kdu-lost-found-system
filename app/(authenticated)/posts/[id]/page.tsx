import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Pencil } from "lucide-react";

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, type, item_name, category, date, location, description, image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <PageLayout title={post.item_name} subtitle={`Reported as ${post.type}`}>
      <article className="max-w-3xl space-y-6">
        <Button nativeButton={false} render={<Link href={`/posts/${post.id}/edit`} />}>
          <Pencil />
          Edit Post
        </Button>
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.item_name}
            className="max-h-[28rem] w-full rounded-lg object-cover"
          />
        )}
        <dl className="grid gap-4 rounded-lg border p-6 sm:grid-cols-2">
          <div><dt className="text-sm text-muted-foreground">Category</dt><dd className="font-medium">{post.category}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Date</dt><dd className="font-medium">{post.date}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Location</dt><dd className="font-medium">{post.location}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-muted-foreground">Description</dt><dd className="whitespace-pre-wrap font-medium">{post.description}</dd></div>
        </dl>
        <Link href="/posts" className="font-medium underline underline-offset-4">
          Back to my posts
        </Link>
      </article>
    </PageLayout>
  );
}