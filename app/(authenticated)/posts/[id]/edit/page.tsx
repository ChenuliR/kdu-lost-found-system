import { notFound } from "next/navigation";
import PageLayout from "@/components/page-layout";
import PostForm from "@/components/posts/post-form";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function EditPostPage({
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
    <PageLayout title="Edit Post" subtitle="Correct the information in your post.">
      <PostForm postType={post.type} initialPost={post} />
    </PageLayout>
  );
}