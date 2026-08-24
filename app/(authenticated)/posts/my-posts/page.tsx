import PageLayout from "@/components/page-layout";
import PostFilter from "@/components/posts/post-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getUserPosts } from "../actions";
import { redirect } from "next/navigation";

async function updatePost(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  const postId = formData.get("postId");
  const itemName = formData.get("itemName");
  const category = formData.get("category");
  const date = formData.get("date");
  const location = formData.get("location");
  const description = formData.get("description");

  if (
    typeof postId !== "string" ||
    typeof itemName !== "string" ||
    typeof category !== "string" ||
    typeof date !== "string" ||
    typeof location !== "string" ||
    typeof description !== "string" ||
    !itemName ||
    !category ||
    !date ||
    !location ||
    !description
  ) {
    throw new Error("All required fields must be filled");
  }

  const { error } = await supabase
    .from("posts")
    .update({ item_name: itemName, category, date, location, description })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/posts/my-posts");
}

async function deletePost(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  const postId = formData.get("postId");

  if (typeof postId !== "string" || !postId) {
    throw new Error("Post could not be identified");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/posts/my-posts");
}

export default async function MyPostsPage() {
  const userPosts = await getUserPosts();

  return (
    <PageLayout
      title={"My Posts"}
      subtitle={"Manage your lost and found listings"}
      badge={
        <Badge variant={"secondary"} className="mb-0">
          {userPosts.length} Posts
        </Badge>
      }
      separator={true}
    >
      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Your active posts</h2>
        {userPosts.map((post) => (
          <div key={post.id} className="rounded-sm border p-4">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-sm bg-muted px-4 py-3 font-medium hover:bg-muted/80">
                <span className="flex items-center gap-3">
                  <span>{post.item_name}</span>
                  <Badge
                    variant={post.status === "Active" ? "secondary" : "outline"}
                  >
                    {post.status ?? "Active"}
                  </Badge>
                </span>
                <span className="rounded-sm border bg-background px-3 py-1 text-sm">
                  Edit post
                </span>
              </summary>
              <form action={updatePost} className="mt-4 grid gap-3 md:grid-cols-2">
                <input type="hidden" name="postId" value={post.id} />
                <label className="grid gap-1 text-sm">
                  Item name
                  <input
                    className="rounded-sm border px-3 py-2"
                    name="itemName"
                    defaultValue={post.item_name}
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Category
                  <input
                    className="rounded-sm border px-3 py-2"
                    name="category"
                    defaultValue={post.category}
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Date
                  <input
                    className="rounded-sm border px-3 py-2"
                    type="date"
                    name="date"
                    defaultValue={post.date}
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Location
                  <input
                    className="rounded-sm border px-3 py-2"
                    name="location"
                    defaultValue={post.location}
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm md:col-span-2">
                  Description
                  <textarea
                    className="rounded-sm border px-3 py-2"
                    name="description"
                    defaultValue={post.description}
                    required
                  />
                </label>
                <Button type="submit" className="w-fit">
                  Save changes
                </Button>
              </form>
            </details>
            <form action={deletePost} className="mt-3">
              <input type="hidden" name="postId" value={post.id} />
              <Button type="submit" variant="destructive">
                Delete post
              </Button>
            </form>
          </div>
        ))}
      </div>
      <PostFilter posts={userPosts} />
    </PageLayout>
  );
}
