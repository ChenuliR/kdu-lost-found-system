import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CategoryLabelsProvider } from "@/components/category-labels-provider";
import { getAuthUser, isAdmin } from "@/lib/auth/server";
import { getCategoryLabelMap } from "@/lib/categories";
import { cookies } from "next/headers";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  const admin = isAdmin(user);
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const labels = await getCategoryLabelMap();

  return (
    <div className="flex">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={user} isAdmin={admin} />
        <main className="flex-1">
          <Navbar />
          <section className="py-8 max-w-6xl w-full mx-auto">
            <CategoryLabelsProvider labels={labels}>
              {children}
            </CategoryLabelsProvider>
          </section>
        </main>
      </SidebarProvider>
    </div>
  );
}
