import PageLayout from "@/components/page-layout";
import PostFilter from "@/components/posts/post-filter";
import { Badge } from "@/components/ui/badge";
import { getUserPosts } from "../actions";

export default async function MyPostsPage() {
  const userPosts = await getUserPosts();

  return (
    <PageLayout
      title={"My Posts"}
      subtitle={"Manage your lost and found listings"}
      badge={
        <Badge variant={"secondary"} className="mb-0">
          {userPosts.length} Active Posts
        </Badge>
      }
      separator={true}
    >
      <PostFilter posts={userPosts} />
    </PageLayout>
  );
}
