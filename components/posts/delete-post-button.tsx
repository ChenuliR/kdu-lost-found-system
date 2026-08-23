"use client";

import { deletePost } from "@/app/(authenticated)/posts/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form
      action={deletePost.bind(null, postId)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this post? This action cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive">
        <Trash2 />
        Delete Post
      </Button>
    </form>
  );
}