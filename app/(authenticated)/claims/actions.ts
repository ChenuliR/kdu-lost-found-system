"use server"

import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

type ClaimStatus = "Pending" | "Approved" | "Rejected";

function isNotificationsTableMissing(error: { code?: string; message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() || "";

  return (
    error?.code === "42P01" ||
    message.includes('relation "public.notifications" does not exist')
  );
}

async function ensureClaimStatusNotification(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  claimId: string,
  claimantId: string,
  status: "Approved" | "Rejected",
) {
  const { data: existingNotification } = await supabase
    .from("notifications")
    .select("id")
    .eq("claim_id", claimId)
    .eq("recipient_id", claimantId)
    .eq("type", "claim_status_changed")
    .maybeSingle();

  if (existingNotification) {
    return;
  }

  const { error } = await supabase.from("notifications").insert({
    recipient_id: claimantId,
    claim_id: claimId,
    type: "claim_status_changed",
    message: `Your claim status has been updated to ${status}.`,
  });

  if (error && !isNotificationsTableMissing(error)) {
    console.error("Failed to create claim status notification", error);
  }
}

export async function submitClaim(
  postId: string,
  data: {
    proof_details: string;
    contact_info: string;
  },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getAuthUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    // Validate inputs
    if (!postId || !data.proof_details.trim() || !data.contact_info.trim()) {
      return { error: "All fields are required" };
    }

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, user_id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return { error: "Post not found" };
    }

    if (post.user_id === user.id) {
      return { error: "You cannot claim your own post" };
    }

    // Check if user already has a claim on this post
    const { data: existingClaim } = await supabase
      .from("claims")
      .select("id")
      .eq("post_id", postId)
      .eq("claimant_id", user.id)
      .single();

    if (existingClaim) {
      return { error: "You already have a claim on this item" };
    }

    // Insert claim
    const { data: claim, error: claimError } = await supabase
      .from("claims")
      .insert({
        post_id: postId,
        claimant_id: user.id,
        proof_details: data.proof_details.trim(),
        contact_info: data.contact_info.trim(),
        status: "Pending",
      })
      .select("id")
      .single();

    if (claimError) {
      return { error: "Failed to submit claim. Please try again." };
    }

    const { data: existingNotification } = await supabase
      .from("notifications")
      .select("id")
      .eq("claim_id", claim.id)
      .eq("recipient_id", post.user_id)
      .eq("type", "claim_submitted")
      .maybeSingle();

    if (!existingNotification) {
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: post.user_id,
          claim_id: claim.id,
          post_id: postId,
          type: "claim_submitted",
          message: "A new claim was submitted for your post.",
        });

      if (notificationError) {
        console.error("Failed to create claim notification", notificationError);
      }
    }

    return { success: true };
  } catch (err) {
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserClaims() {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getAuthUser();

    if (!user) {
      return { error: "Unauthorized", claims: [] };
    }

    const { data: claims, error } = await supabase
      .from("claims")
      .select(
        `
        id,
        post_id,
        status,
        proof_details,
        contact_info,
        created_at,
        reviewed_at,
        admin_comments,
        posts:post_id (
          id,
          item_name,
          type,
          category,
          location,
          date,
          image_url,
          user_id
        )
      `,
      )
      .eq("claimant_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { error: "Failed to fetch claims", claims: [] };
    }

    return { success: true, claims: claims || [] };
  } catch (err) {
    return { error: "An unexpected error occurred", claims: [] };
  }
}

export async function getAdminClaims() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    return [];
  }

  const { data: claims, error } = await supabase
    .from("claims")
    .select(
      `
      id,
      status,
      created_at,
      posts:post_id (item_name),
      claimant_id
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch admin claims");
  }

  return (claims || []).map((claim) => {
    const post = claim.posts as
      | { item_name: string }
      | { item_name: string }[]
      | null;

    return {
      id: claim.id,
      status: claim.status as ClaimStatus,
      createdAt: claim.created_at,
      item: (Array.isArray(post) ? post[0] : post)?.item_name ?? "Unknown item",
      claimant: claim.claimant_id,
    };
  });
}

export async function getAdminClaimById(id: string) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: claim, error } = await supabase
    .from("claims")
    .select(
      `
      id,
      claimant_id,
      status,
      proof_details,
      contact_info,
      admin_comments,
      created_at,
      reviewed_at,
      posts:post_id (
        item_name,
        type,
        category,
        date,
        location,
        description,
        image_url
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !claim) {
    throw new Error("Claim not found");
  }

  const post = Array.isArray(claim.posts) ? claim.posts[0] : claim.posts;

  return {
    id: claim.id,
    claimantId: claim.claimant_id,
    status: claim.status as ClaimStatus,
    proofDetails: claim.proof_details,
    contactInfo: claim.contact_info,
    adminComments: claim.admin_comments,
    createdAt: claim.created_at,
    reviewedAt: claim.reviewed_at,
    post: post
      ? {
          itemName: post.item_name,
          type: post.type,
          category: post.category,
          date: post.date,
          location: post.location,
          description: post.description,
          imageUrl: post.image_url,
        }
      : null,
  };
}

export async function updateClaimStatus(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const claimId = String(formData.get("claimId") || "");
  const status = String(formData.get("status") || "");
  const adminComments = String(formData.get("adminComments") || "").trim();

  if (!claimId || !["Approved", "Rejected"].includes(status)) {
    throw new Error("Invalid claim update");
  }

  const { data: claim, error } = await supabase
    .from("claims")
    .update({
      status,
      admin_comments: adminComments || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", claimId)
    .select("claimant_id")
    .single();

  if (error || !claim) {
    throw new Error("Failed to update claim");
  }

  await ensureClaimStatusNotification(supabase, claimId, claim.claimant_id, status as "Approved" | "Rejected");
}

export async function updateClaimStatusByOwner(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const claimId = String(formData.get("claimId") || "");
  const status = String(formData.get("status") || "");
  const adminComments = String(formData.get("adminComments") || "").trim();

  if (!claimId || !["Approved", "Rejected"].includes(status)) {
    throw new Error("Invalid claim update");
  }

  const { error } = await supabase.rpc("review_claim_as_owner", {
    p_claim_id: claimId,
    p_status: status,
    p_comments: adminComments || null,
  });

  if (error) {
    const functionIsMissing =
      error.code === "PGRST202" ||
      error.message.toLowerCase().includes("could not find the function");
    const notificationsTableIsMissing = isNotificationsTableMissing(error);

    if (!functionIsMissing && !notificationsTableIsMissing) {
      throw new Error(error.message || "Failed to review claim");
    }

    const { data: claim } = await supabase
      .from("claims")
      .select("id, post_id, claimant_id")
      .eq("id", claimId)
      .eq("status", "Pending")
      .single();

    const { data: post } = claim
      ? await supabase
          .from("posts")
          .select("user_id")
          .eq("id", claim.post_id)
          .single()
      : { data: null };

    if (!claim || post?.user_id !== user.id) {
      throw new Error("You are not allowed to review this claim");
    }

    const { data: updatedClaim, error: updateError } = await supabase
      .from("claims")
      .update({
        status,
        admin_comments: adminComments || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", claimId)
      .eq("status", "Pending")
      .select("id")
      .maybeSingle();

    if (updateError || !updatedClaim) {
      throw new Error(
        "Claim review is not enabled in Supabase. Run docs/claim-review-migration.sql in the Supabase SQL Editor, then refresh the app.",
      );
    }

    await ensureClaimStatusNotification(supabase, claimId, claim.claimant_id, status as "Approved" | "Rejected");
  }

  redirect("/posts/my-posts");
}

export async function getClaimForReview(id: string) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: claim, error } = await supabase
    .from("claims")
    .select(
      `
      id,
      claimant_id,
      post_id,
      status,
      proof_details,
      contact_info,
      admin_comments,
      created_at,
      reviewed_at
    `,
    )
    .eq("id", id)
    .single();

  if (error || !claim) {
    throw new Error("Claim not found");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, user_id, item_name, type, category, date, location, description, image_url")
    .eq("id", claim.post_id)
    .single();

  if (postError || !post || (claim.claimant_id !== user.id && post.user_id !== user.id)) {
    throw new Error("Claim not found");
  }

  return {
    id: claim.id,
    claimantId: claim.claimant_id,
    status: claim.status as ClaimStatus,
    proofDetails: claim.proof_details,
    contactInfo: claim.contact_info,
    adminComments: claim.admin_comments,
    createdAt: claim.created_at,
    reviewedAt: claim.reviewed_at,
    isPostOwner: post.user_id === user.id,
    post,
  };
}

export async function getNotifications() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    return [];
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("id, claim_id, post_id, message, created_at, read_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (isNotificationsTableMissing(error)) {
      return [];
    }

    throw new Error("Failed to fetch notifications");
  }

  return notifications || [];
}

export async function getUnreadNotificationCount() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    return 0;
  }

  const { count: pendingClaims, error: pendingError } = await supabase
    .from("claims")
    .select("id, posts!inner(user_id)", { count: "exact", head: true })
    .eq("status", "Pending")
    .eq("posts.user_id", user.id);

  if (pendingError) {
    return 0;
  }

  const { count: statusNotifications, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("type", "claim_status_changed")
    .is("read_at", null);

  return error ? pendingClaims ?? 0 : (pendingClaims ?? 0) + (statusNotifications ?? 0);
}

export async function markNotificationsAsRead() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    return;
  }

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", user.id)
    .is("read_at", null);
}

export async function getPendingClaimNotifications() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    return [];
  }

  const { data: claims, error } = await supabase
    .from("claims")
    .select(
      `
      id,
      post_id,
      claimant_id,
      proof_details,
      created_at,
      posts:post_id!inner (
        id,
        user_id,
        item_name
      )
    `,
    )
    .eq("status", "Pending")
    .eq("posts.user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch claim notifications");
  }

  return (claims || []).map((claim) => {
    const post = Array.isArray(claim.posts) ? claim.posts[0] : claim.posts;

    return {
      id: claim.id,
      postId: claim.post_id,
      claimantId: claim.claimant_id,
      proofDetails: claim.proof_details,
      createdAt: claim.created_at,
      itemName: post?.item_name ?? "Unknown item",
    };
  });
}

export async function getNotificationFeed() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    return [];
  }

  const [pendingClaims, reviewedClaims, ownerReviewedClaims] = await Promise.all([
    getPendingClaimNotifications(),
    supabase
      .from("claims")
      .select(
        `
        id,
        post_id,
        status,
        created_at,
        reviewed_at,
        posts:post_id!inner (
          id,
          item_name
        )
      `,
      )
      .eq("claimant_id", user.id)
      .in("status", ["Approved", "Rejected"])
      .order("created_at", { ascending: false }),
    supabase
      .from("claims")
      .select(
        `
        id,
        post_id,
        status,
        created_at,
        reviewed_at,
        posts:post_id!inner (
          id,
          user_id,
          item_name
        )
      `,
      )
      .in("status", ["Approved", "Rejected"])
      .eq("posts.user_id", user.id)
      .order("reviewed_at", { ascending: false }),
  ]);

  if (reviewedClaims.error) {
    throw new Error("Failed to fetch notification feed");
  }

  if (ownerReviewedClaims.error) {
    throw new Error("Failed to fetch post claim updates");
  }

  const pendingItems = pendingClaims.map((claim) => ({
    id: `pending-${claim.id}`,
    kind: "claim_request" as const,
    createdAt: claim.createdAt,
    message: `New claim request for ${claim.itemName}.`,
    detail: claim.proofDetails,
    href: `/posts/${claim.postId}`,
    linkLabel: "View post",
    read: false,
  }));

  const statusItems = (reviewedClaims.data || []).map((claim) => {
    const post = Array.isArray(claim.posts) ? claim.posts[0] : claim.posts;

    return {
    id: `status-${claim.id}`,
    kind: "claim_status" as const,
    createdAt: claim.reviewed_at ?? claim.created_at,
    message: `Your claim for ${post?.item_name ?? "this item"} was ${claim.status.toLowerCase()}.`,
    detail: null,
    href: `/claims/${claim.id}`,
    linkLabel: "View claim",
    read: false,
    };
  });

  const ownerStatusItems = (ownerReviewedClaims.data || []).map((claim) => {
    const post = Array.isArray(claim.posts) ? claim.posts[0] : claim.posts;

    return {
      id: `owner-status-${claim.id}`,
      kind: "claim_status" as const,
      createdAt: claim.reviewed_at ?? claim.created_at,
      message: `A claim for ${post?.item_name ?? "your item"} was ${claim.status.toLowerCase()}.`,
      detail: null,
      href: `/posts/${claim.post_id}`,
      linkLabel: "View post",
      read: true,
    };
  });

  return [...pendingItems, ...statusItems, ...ownerStatusItems].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}