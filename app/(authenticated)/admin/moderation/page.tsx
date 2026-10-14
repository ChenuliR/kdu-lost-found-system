import { getFlaggedPosts } from "@/app/(authenticated)/admin/actions";
import AdminModeration from "@/components/admin-moderation";
import PageLayout from "@/components/page-layout";

export default async function AdminModerationPage() {
  const posts = await getFlaggedPosts();

  return (
    <PageLayout
      title="Flagged Posts"
      subtitle="Reported posts and posts older than 30 days."
    >
      <AdminModeration posts={posts} total={posts.length} fixedHeight={false} />
    </PageLayout>
  );
}