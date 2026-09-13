"use server";

import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const claimStatuses = ["Pending", "Approved", "Rejected"] as const;
type ClaimStatus = (typeof claimStatuses)[number];

function isAdmin(user: User) {
  return user.app_metadata?.role === "admin";
}

export async function submitClaim(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  const postId = formData.get("postId");
  const proofDetails = formData.get("proofDetails");
  const contactInfo = formData.get("contactInfo");

  if (
    typeof postId !== "string" ||
    typeof proofDetails !== "string" ||
    typeof contactInfo !== "string" ||
    !proofDetails.trim() ||
    !contactInfo.trim()
  ) {
    throw new Error("Claim details are required");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("status")
    .eq("id", postId)
    .single();

  if (postError || !post || post.status !== "Active") {
    throw new Error("This item is no longer available for claims");
  }

  const { error } = await supabase.from("claims").insert({
    post_id: postId,
    claimant_id: user.id,
    proof_details: proofDetails.trim(),
    contact_info: contactInfo.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/posts/${postId}`);
}

export async function getAdminClaims() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!isAdmin(user)) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("claims")
    .select("id, post_id, claimant_id, status, created_at, posts(item_name, user_id)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((claim) => {
    const post = Array.isArray(claim.posts) ? claim.posts[0] : claim.posts;

    return {
      id: claim.id,
      item: post?.item_name ?? "Unknown item",
      claimant: claim.claimant_id,
      status: claim.status as ClaimStatus,
      createdAt: claim.created_at,
    };
  });
}

export async function updateClaimStatus(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  const claimId = formData.get("claimId");
  const status = formData.get("status");

  if (
    !isAdmin(user) ||
    typeof claimId !== "string" ||
    !claimStatuses.includes(status as ClaimStatus) ||
    status === "Pending"
  ) {
    throw new Error("Unauthorized");
  }

  const { data: claim, error: claimError } = await supabase
    .from("claims")
    .select("status")
    .eq("id", claimId)
    .single();

  if (claimError || !claim) {
    throw new Error("Claim could not be found");
  }

  if (claim.status === status) {
    return;
  }

  const { error } = await supabase
    .from("claims")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", claimId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/notifications");
}

export async function getNotifications() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from("notifications")
    .select("id, message, type, read_at, created_at, claim_id")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}