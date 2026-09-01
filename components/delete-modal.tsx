"use client";

import { deletePost } from "@/app/(authenticated)/posts/actions";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function DeleteModal({
  id,
  disabled,
}: {
  id: number;
  disabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await deletePost(formData);
    },
    null,
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            disabled={disabled}
          >
            Delete post
          </Button>
        }
      />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-3">
          <DialogClose
            render={(props) => (
              <Button
                {...props}
                type="button"
                variant={"outline"}
                className="col-start-1 w-full cursor-pointer"
                disabled={isPending}
              >
                Close
              </Button>
            )}
          />
          <form action={formAction} className="col-start-3 w-full">
            <input type="hidden" name="postId" value={id} />
            <Button
              type="submit"
              variant="destructive"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Deleting" : "Delete"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
