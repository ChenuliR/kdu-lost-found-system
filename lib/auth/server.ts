import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server-client";
import type { User } from "@supabase/supabase-js";

export async function getAuthUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("Redirect to auth");
    redirect("/auth");
  }

  return user;
}

export function isAdmin(user: User) {
  return user.app_metadata?.role === "admin";
}

export async function requireAdmin() {
  const user = await getAuthUser();

  if (!isAdmin(user)) {
    redirect("/");
  }

  return user;
}