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
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      type: postType,
      item_name: itemName,
      category,
      date,
      location,
      description,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

export async function updatePost(
  id: string,
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
  const imageFile = formData.get("image") as File | null;

  if (!itemName || !category || !date || !location || !description) {
    throw new Error("All required fields must be filled");
  }

  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_FILE_SIZE) {
      throw new Error("Image file is must be less than 10MB");
    }
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      throw new Error("Only JPEG/JPG/PNG are allowed");
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${imageFile.name}`;
    const filePath = `${postType}/${user.id}/${filename}`;
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
    imageUrl = data.publicUrl;
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      type: postType,
      item_name: itemName,
      category,
      date,
      location,
      description,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

export async function deletePost(id: string) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/posts");
}
