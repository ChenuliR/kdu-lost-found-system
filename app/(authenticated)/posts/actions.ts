"use server";

import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export async function createPost(
  formData: FormData,
  postType: "lost" | "found",
) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  const itemName = formData.get("itemName") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  // Validate required fields
  if (
    !itemName ||
    !category ||
    !date ||
    !location ||
    !description ||
    !imageFile
  ) {
    throw new Error("All required fields must be filled");
  }

  let imageUrl: string | null = null;

  // Validate image
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_FILE_SIZE) {
      throw new Error("Image file is must be less than 10MB");
    }
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      throw new Error("Only JPEG/JPG/PNG are allowed");
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${imageFile.name}`;
    const filePath = `${postType}/${user.id}/${filename}`;
    const { error } = await supabase.storage
      .from("posts")
      .upload(filePath, imageFile);

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
    imageUrl = data.publicUrl;
  }

  // Insert post into database
  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    type: postType,
    item_name: itemName,
    category,
    date,
    location,
    description: description,
    image_url: imageUrl,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/posts");
}

export async function getUserPosts(type?: PostType) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  let query = supabase.from("posts").select("*").eq("user_id", user.id);

  // Filter if type specified
  if (type) {
    query = query.eq("type", type);
  }

  const { data: posts, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw error;
  }

  return posts;
}