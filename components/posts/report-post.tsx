"use client";

import { reportPost } from "@/app/(authenticated)/posts/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Loader2 } from "lucide-react";
import { useActionState } from "react";

type ReportState = { error?: string; success?: boolean } | null;

export default function ReportPost({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ReportState, formData: FormData) => reportPost(formData),
    null,
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Flag />
            Report
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report post</DialogTitle>
          <DialogDescription>
            Tell the admins what is wrong with this post.
          </DialogDescription>
        </DialogHeader>
        {state?.success ? (
          <p className="text-sm">Thanks, your report was sent to the admins.</p>
        ) : (
          <form action={formAction} className="space-y-3">
            <input type="hidden" name="postId" value={postId} />
            <select
              name="reason"
              required
              defaultValue=""
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="" disabled>
                Select a reason
              </option>
              <option>Duplicate</option>
              <option>Inappropriate</option>
              <option>Spam</option>
              <option>Other</option>
            </select>
            <Textarea name="details" placeholder="Details (optional)" />
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Submit report
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}