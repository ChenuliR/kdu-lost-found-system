import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";
import AuthComponent from "../../components/AuthCard";

export default async function AuthPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({ user });
  if (user) {
    redirect("/");
  }

  return <AuthComponent />;
}
