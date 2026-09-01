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

  return (
    <PageLayout>
      <PostDetail post={post} user={user} />
    </PageLayout>
  );
}
