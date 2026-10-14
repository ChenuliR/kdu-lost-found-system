"use server";

import { requireAdmin } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const [active, pending, resolved] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .or("status.eq.Active,status.is.null"),
    supabase
      .from("claims")
      .select("id", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("claims")
      .select("id", { count: "exact", head: true })
      .eq("status", "Approved"),
  ]);

  if (active.error || pending.error || resolved.error) {
    throw new Error("Failed to fetch admin stats");
  }

  return {
    activePosts: active.count ?? 0,
    pendingClaims: pending.count ?? 0,
    resolvedCases: resolved.count ?? 0,
  };
}

export async function getFlaggedPosts() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [reports, expired] = await Promise.all([
    supabase
      .from("post_reports")
      .select("id, reason, details, created_at, posts:post_id (id, item_name)")
      .eq("status", "Open")
      .order("created_at", { ascending: false }),
    supabase
      .from("posts")
      .select("id, item_name, created_at")
      .or("status.eq.Active,status.is.null")
      .lt("created_at", cutoff)
      .order("created_at", { ascending: true }),
  ]);

  if (reports.error || expired.error) {
    throw new Error("Failed to fetch flagged posts");
  }

  const reported = (reports.data ?? []).flatMap((report) => {
    const post = Array.isArray(report.posts) ? report.posts[0] : report.posts;
    if (!post) return [];

    return [
      {
        key: `report-${report.id}`,
        postId: post.id as string,
        reportId: report.id as string | null,
        item: post.item_name as string,
        reason: `Reported: ${report.reason}`,
        detail:
          report.details ||
          `Reported on ${new Date(report.created_at).toLocaleDateString()}`,
        alert: true,
      },
    ];
  });

  const expiredItems = (expired.data ?? []).map((post) => ({
    key: `expired-${post.id}`,
    postId: post.id as string,
    reportId: null as string | null,
    item: post.item_name as string,
    reason: "Expired (>30 days)",
    detail: `Posted ${new Date(post.created_at).toLocaleDateString()}`,
    alert: false,
  }));

  return [...reported, ...expiredItems];
}

export async function dismissReport(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const reportId = formData.get("reportId");

  if (typeof reportId !== "string" || !reportId) {
    throw new Error("Report could not be identified");
  }

  const { error } = await supabase
    .from("post_reports")
    .update({ status: "Dismissed" })
    .eq("id", reportId);

  if (error) {
    throw new Error("Failed to dismiss report");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/moderation");
}

export async function removePost(formData: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const postId = formData.get("postId");

  if (typeof postId !== "string" || !postId) {
    throw new Error("Post could not be identified");
  }

  const { data: post } = await supabase
    .from("posts")
    .select("image_url")
    .eq("id", postId)
    .single();

  // .select() so a policy-blocked delete (0 rows) is detected instead of silently passing
  const { data: deleted, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .select("id");

  if (error || !deleted?.length) {
    throw new Error("Failed to remove post");
  }

  const imagePath = post?.image_url?.split("/object/public/posts/")[1];
  if (imagePath) {
    const { error: storageError } = await supabase.storage
      .from("posts")
      .remove([decodeURIComponent(imagePath)]);

    if (storageError) {
      console.error("Failed to remove post image", storageError);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/moderation");
  revalidatePath("/");
}

export async function getAdminPosts({
  q = "",
  status = "All",
  type = "All",
  page = 1,
  pageSize = 15,
}: {
  q?: string;
  status?: "All" | "Active" | "Claimed";
  type?: "All" | "lost" | "found";
  page?: number;
  pageSize?: number;
} = {}) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("posts")
    .select("id, item_name, type, category, status, created_at", {
      count: "exact",
    });

  if (q) {
    query = query.ilike("item_name", `%${q}%`);
  }
  if (status === "Active") {
    query = query.or("status.eq.Active,status.is.null");
  } else if (status !== "All") {
    query = query.eq("status", status);
  }
  if (type !== "All") {
    query = query.eq("type", type);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    throw new Error("Failed to fetch posts");
  }

  return { posts: data ?? [], total: count ?? 0 };
}