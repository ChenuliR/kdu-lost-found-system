"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlert, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

const flaggedPosts = [
  {
    item: "Blue Hydroflask Water Bottle",
    reason: "Suspected Duplicate",
    detail: "Reported by Auto-Mod • ID #8892",
    alert: true,
  },
  {
    item: "Physics 101 Textbook",
    reason: "Expired (>30 Days)",
    detail: "System Check • ID #8104",
    alert: false,
  },
  {
    item: "Umbrella - Black",
    reason: "Expired (>30 Days)",
    detail: "System Check • ID #7942",
    alert: false,
  },
];

export default function AdminModeration() {
  const [removedPosts, setRemovedPosts] = useState<string[]>([]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between border-b">
        <CardTitle>Post Moderation</CardTitle>
        <Button variant="ghost" size="icon-sm" aria-label="More moderation options">
          <MoreVertical />
        </Button>
      </CardHeader>
      <CardContent className="gap-3 p-4">
        {flaggedPosts
          .filter((post) => !removedPosts.includes(post.item))
          .map((post) => (
            <div key={post.item} className="rounded-lg border bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{post.item}</p>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${post.item}`}
                  onClick={() =>
                    setRemovedPosts((current) => [...current, post.item])
                  }
                >
                  <Trash2 />
                </Button>
              </div>
              <p
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${post.alert ? "text-destructive" : "text-muted-foreground"}`}
              >
                {post.alert ? (
                  <CircleAlert />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground" />
                )}
                Flagged: {post.reason}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{post.detail}</p>
            </div>
          ))}
        {removedPosts.length === flaggedPosts.length && (
          <p className="text-sm text-muted-foreground">No flagged posts remain.</p>
        )}
        <Button variant="ghost" className="mt-1 w-full justify-center text-sm">
          View All Flagged Posts
        </Button>
      </CardContent>
    </Card>
  );
}