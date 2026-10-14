"use client";

import { removePost } from "@/app/(authenticated)/admin/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function AdminRemovePostButton({
  postId,
  itemName,
}: {
  postId: string;
  itemName: string;
}) {
  return (
    <form
      action={removePost}
      onSubmit={(e) => {
        if (!confirm(`Permanently remove "${itemName}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="postId" value={postId} />
      <Button
        type="submit"
        variant="ghost"
        size="icon-xs"
        aria-label={`Remove ${itemName}`}
      >
        <Trash2 />
      </Button>
    </form>
  );
}