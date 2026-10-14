import PageLayout from "@/components/page-layout";
import PostFilter from "@/components/posts/post-filter";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "./posts/actions";
import { getCategories } from "@/lib/categories";

export default async function BrowsePage() {
  const allPosts = await getAllPosts();
  const categories = await getCategories({ includeInactive: true });

  return (
    <PageLayout
      title={"Browse Posts"}
      subtitle={"Find all lost and found listings"}
      badge={
        <div className="flex flex-col items-end gap-2">
          <Badge variant={"secondary"} className="mb-0">
            {allPosts.length} Posts
          </Badge>
        </div>
      }
      separator={true}
    >
      <PostFilter posts={allPosts} categories={categories} />
    </PageLayout>
  );
}
