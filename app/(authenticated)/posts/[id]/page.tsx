import PageLayout from "@/components/page-layout";
import PostDetail from "@/components/posts/post-detail";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { notFound } from "next/navigation";

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: claims } =
    user?.id === post.user_id
      ? await supabase
          .from("claims")
          .select("id, claimant_id, status, proof_details, created_at")
          .eq("post_id", post.id)
          .order("created_at", { ascending: false })
      : { data: [] };

  const { data: comments } = await supabase
    .from("comments")
    .select("id, author_id, content, created_at")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  return (
    <PageLayout>
      <PostDetail
        post={post}
        user={user}
        claims={claims ?? []}
        comments={comments ?? []}
      />
    </PageLayout>
  );
}
