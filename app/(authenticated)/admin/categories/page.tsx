import AdminCategories from "@/components/admin-categories";
import PageLayout from "@/components/page-layout";
import { getAdminCategories } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <PageLayout
      title="Categories"
      subtitle="Manage the item categories used in posts and filters."
    >
      <AdminCategories categories={categories} />
    </PageLayout>
  );
}