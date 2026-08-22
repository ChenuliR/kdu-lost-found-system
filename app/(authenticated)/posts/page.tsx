import Link from "next/link";
import PageLayout from "@/components/page-layout";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type Post = {
  id: string;
  type: PostType;
  item_name: string;
  category: string;
  date: string;
  location: string;
  description: string;
  image_url: string | null;
};

export default async function PostsPage() {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, type, item_name, category, date, location, description, image_url")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <PageLayout title="My Posts" subtitle="Posts you have reported.">
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {(posts as Post[]).map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.item_name}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="space-y-2 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold">{post.item_name}</h2>
                  <span className="text-sm capitalize text-muted-foreground">{post.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{post.category} · {post.location}</p>
                <p className="line-clamp-2 text-sm">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">You have not created any posts yet.</p>
          <Link href="/posts/new" className="font-medium underline underline-offset-4">
            Create a post
          </Link>
        </div>
      )}
    </PageLayout>
  );
}