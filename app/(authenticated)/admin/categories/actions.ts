"use server";

import { requireAdmin } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { revalidatePath } from "next/cache";

function toSlug(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAdminCategories() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const [categories, posts] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, label, active")
      .order("sort_order")
      .order("label"),
    supabase.from("posts").select("category"),
  ]);

  if (categories.error || posts.error) {
    throw new Error("Failed to fetch categories");
  }

  const counts = new Map<string, number>();
  for (const post of posts.data ?? []) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }

  return (categories.data ?? []).map((c) => ({
    slug: c.slug as string,
    label: c.label as string,
    active: c.active as boolean,
    postCount: counts.get(c.slug) ?? 0,
  }));
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const label = String(formData.get("label") ?? "").trim();
  const slug = toSlug(label);

  if (!label || !slug) {
    return { error: "Enter a category name" };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ slug, label, sort_order: 50 });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "That category already exists"
          : "Failed to create category",
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function renameCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const slug = formData.get("slug");
  const label = String(formData.get("label") ?? "").trim();

  if (typeof slug !== "string" || !slug || !label) {
    throw new Error("Category name cannot be empty");
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ label })
    .eq("slug", slug)
    .select("slug");

  if (error || !data?.length) {
    throw new Error("Failed to rename category");
  }

  revalidatePath("/", "layout");
}

export async function toggleCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const slug = formData.get("slug");
  const active = formData.get("active") === "true";

  if (typeof slug !== "string" || !slug) {
    throw new Error("Category could not be identified");
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ active })
    .eq("slug", slug)
    .select("slug");

  if (error || !data?.length) {
    throw new Error("Failed to update category");
  }

  revalidatePath("/", "layout");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const slug = formData.get("slug");

  if (typeof slug !== "string" || !slug) {
    throw new Error("Category could not be identified");
  }

  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("category", slug);

  if (count) {
    throw new Error("Category is in use. Deactivate it instead.");
  }

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("slug", slug)
    .select("slug");

  if (error || !data?.length) {
    throw new Error("Failed to delete category");
  }

  revalidatePath("/", "layout");
}