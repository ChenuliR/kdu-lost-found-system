import PageLayout from "@/components/page-layout";
import PostFilter from "@/components/posts/post-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getUserPosts } from "../actions";

export default async function MyPostsPage() {
  const userPosts = await getUserPosts();

  return (
    <PageLayout
      title={"My Posts"}
      subtitle={"Manage your lost and found listings"}
      badge={
        <div className="flex flex-col items-end gap-2">
          <Link href="/posts/new">
            <Button className="cursor-pointer">
              <Plus />
              <span>Create Post</span>
            </Button>
          </Link>
          <Badge variant={"secondary"} className="mb-0">
            {userPosts.length} Posts
          </Badge>
        </div>
      }
      separator={true}
    >
      <PostFilter posts={userPosts} />
    </PageLayout>
  );
}
