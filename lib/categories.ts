import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { cache } from "react";

export type CategoryOption = { label: string; value: string };

export async function getCategories({
  includeInactive = false,
}: { includeInactive?: boolean } = {}): Promise<CategoryOption[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase.from("categories").select("slug, label");
  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query.order("sort_order").order("label");

  if (error) throw error;

  return (data ?? []).map((c) => ({ label: c.label, value: c.slug }));
}

export const getCategoryLabelMap = cache(
  async (): Promise<Record<string, string>> => {
    const all = await getCategories({ includeInactive: true });
    return Object.fromEntries(all.map((c) => [c.value, c.label]));
  },
);