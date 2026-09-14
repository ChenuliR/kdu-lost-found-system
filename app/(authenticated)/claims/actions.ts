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
    .select("status, type")
    .eq("id", postId)
    .single();

  if (postError || !post || post.status !== "Active" || post.type !== "found") {
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

export async function getAdminClaimById(claimId: string) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!isAdmin(user)) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("claims")
    .select(
      "id, post_id, claimant_id, proof_details, contact_info, status, admin_comments, created_at, reviewed_at, reviewed_by, posts(item_name, category, type, date, location, description, image_url, status, user_id)",
    )
    .eq("id", claimId)
    .single();

  if (error || !data) {
    throw new Error("Claim could not be found");
  }

  const post = Array.isArray(data.posts) ? data.posts[0] : data.posts;

  return {
    id: data.id,
    postId: data.post_id,
    claimantId: data.claimant_id,
    proofDetails: data.proof_details,
    contactInfo: data.contact_info,
    status: data.status as ClaimStatus,
    adminComments: data.admin_comments,
    createdAt: data.created_at,
    reviewedAt: data.reviewed_at,
    reviewedBy: data.reviewed_by,
    post: post
      ? {
          itemName: post.item_name,
          category: post.category,
          type: post.type,
          date: post.date,
          location: post.location,
          description: post.description,
          imageUrl: post.image_url,
          status: post.status,
          ownerId: post.user_id,
        }
      : null,
  };
}

export async function getUserClaims() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from("claims")
    .select("id, status, created_at, posts(item_name, image_url)")
    .eq("claimant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((claim) => {
    const post = Array.isArray(claim.posts) ? claim.posts[0] : claim.posts;

    return {
      id: claim.id,
      itemName: post?.item_name ?? "Unknown item",
      imageUrl: post?.image_url ?? null,
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
  const adminComments = formData.get("adminComments");

  if (
    !isAdmin(user) ||
    typeof claimId !== "string" ||
    !claimStatuses.includes(status as ClaimStatus) ||
    status === "Pending" ||
    (adminComments !== null && typeof adminComments !== "string")
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

  if (claim.status !== "Pending") {
    throw new Error("Only pending claims can be reviewed");
  }

  const { error } = await supabase
    .from("claims")
    .update({
      status,
      admin_comments:
        typeof adminComments === "string" && adminComments.trim()
          ? adminComments.trim()
          : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", claimId)
    .eq("status", "Pending");

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/claims/${claimId}`);
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