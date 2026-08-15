import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient<SupabaseSchema> | null = null;

export const getSupabaseBrowserClient = (): SupabaseClient<SupabaseSchema> => {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_ANON_KEY");
  }

  client = createBrowserClient<SupabaseSchema>(supabaseUrl, supabaseAnonKey)
  return client;
};
