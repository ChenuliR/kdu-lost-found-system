import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server-client";

export async function getAuthUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("Redirect to auth")
    redirect("/auth");
  }

  return user;
}
