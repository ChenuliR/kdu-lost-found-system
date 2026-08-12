import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import LoginComponent from "./AuthCard";

export default async function AuthPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({ user });

  return <LoginComponent user={user} />;
}
