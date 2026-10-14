"use client";

import { dismissReport, removePost } from "@/app/(authenticated)/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlert, Trash2, X } from "lucide-react";
import Link from "next/link";

export type FlaggedPost = {
  key: string;
  postId: string;
  reportId: string | null;
  item: string;
  reason: string;
  detail: string;
  alert: boolean;
};

export default function AdminModeration({
  posts,
  total,
  fixedHeight = true,
}: {
  posts: FlaggedPost[];
  total: number;
  fixedHeight?: boolean;
}) {
  return (
    <Card
      className={`flex flex-col gap-0 pb-0 ${fixedHeight ? "h-[36rem]" : ""}`}
    >
      <CardHeader className="shrink-0 border-b">
        <CardTitle>Post Moderation</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Reported posts and listings older than 30 days.
        </p>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 gap-3 overflow-y-auto p-4">
        {posts.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No flagged posts.
          </p>
        )}
        {posts.map((post) => (
          <div key={post.key} className="rounded-lg border bg-muted/20 p-3">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/posts/${post.postId}`}
                className="text-sm font-semibold hover:underline"
              >
                {post.item}
              </Link>
              <div className="flex shrink-0 gap-1">
                {post.reportId && (
                  <form action={dismissReport}>
                    <input
                      type="hidden"
                      name="reportId"
                      value={post.reportId}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Dismiss report for ${post.item}`}
                    >
                      <X />
                    </Button>
                  </form>
                )}
                <form
                  action={removePost}
                  onSubmit={(e) => {
                    if (!confirm("Permanently remove this post?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="postId" value={post.postId} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${post.item}`}
                  >
                    <Trash2 />
                  </Button>
                </form>
              </div>
            </div>
            <p
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                post.alert ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {post.alert ? (
                <CircleAlert className="size-3" />
              ) : (
                <span className="size-1.5 rounded-full bg-muted-foreground" />
              )}
              {post.reason}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{post.detail}</p>
          </div>
        ))}
      </CardContent>

      {total > posts.length && (
        <div className="shrink-0 border-t p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-sm"
            nativeButton={false}
            render={<Link href="/admin/moderation" />}
          >
            View all {total} flagged posts
          </Button>
        </div>
      )}
    </Card>
  );
}