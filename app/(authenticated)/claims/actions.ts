"use server"

import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

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
      .select("id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return { error: "Post not found" };
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
    const { error: claimError } = await supabase.from("claims").insert({
      post_id: postId,
      claimant_id: user.id,
      proof_details: data.proof_details.trim(),
      contact_info: data.contact_info.trim(),
      status: "Pending",
    });

    if (claimError) {
      return { error: "Failed to submit claim. Please try again." };
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