import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AuthUser = {
  user: User | null;
};

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="flex">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={user} />
        <main className="flex-1">
          <Navbar />
          <section className="py-8 max-w-7xl w-full mx-auto">{children}</section>
        </main>
      </SidebarProvider>
    </div>
  );
}
