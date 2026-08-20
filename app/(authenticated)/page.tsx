import UserComponent from "@/components/user-component";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function BrowsePage() {
  const user = await getAuthUser()

  return <UserComponent user={user} />;
}
