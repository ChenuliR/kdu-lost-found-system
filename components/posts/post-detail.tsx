"use client";

import { createComment, updatePost } from "@/app/(authenticated)/posts/actions";
import { submitClaim } from "@/app/(authenticated)/claims/actions";
import DeleteModal from "@/components/delete-modal";
import ImageModal from "@/components/image-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@supabase/supabase-js";
import { Bell, Calendar, Check, Clock3, KeyRound, Loader2, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import Link from "next/link";

const categories = [
  ["Laptop/Computer", "laptop/computer"],
  ["Phone", "phone"],
  ["Wallet/Cash", "wallet/cash"],
  ["Backpack/Bag", "backpack/bag"],
  ["Keys", "keys"],
  ["Headphones/Earbuds", "headphones/earbuds"],
  ["Watch", "watch"],
  ["Water Bottle", "water-bottle"],
  ["Clothing", "clothing"],
  ["Documents/ID", "documents/id"],
  ["Books/Notebooks", "books/notebooks"],
  ["Jewellery", "jewellery"],
  ["Other", "other"],
] as const;

type PostClaim = {
  id: string;
  claimant_id: string;
  status: "Pending" | "Approved" | "Rejected";
  proof_details: string;
  created_at: string;
};

type PostComment = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
};

export default function PostDetail({
  post,
  user,
  claims,
  comments,
}: {
  post: any;
  user: User;
  claims: PostClaim[];
  comments: PostComment[];
}) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await updatePost(formData);
    },
    null,
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{post.item_name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant={post.status === "Active" ? "secondary" : "outline"}>
            {post.status ?? "Active"}
          </Badge>
          <Badge>{post.type}</Badge>
        </div>
      </div>
      <section className="flex gap-4">
        <main className="w-full space-y-4">
          <div className="relative w-full aspect-video bg-gray-200 grid grid-cols-2 rounded-sm overflow-hidden">
            {post.image_url ? (
              <>
                <Image
                  src={post.image_url}
                  alt={post.item_name}
                  fill
                  className="object-cover"
                />
                <ImageModal
                  imageUrl={post.image_url}
                  itemName={post.item_name}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <Card className="rounded-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="font-semibold">Item Details</CardTitle>
              <CardContent className="p-0 grid grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-xs/snug font-medium">Category</h4>
                  <Badge className="text-muted-foreground" variant={"outline"}>
                    {post.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs/snug font-medium">Date {post.type}</h4>
                  <Badge className="text-muted-foreground" variant={"outline"}>
                    <Calendar size={16} />
                    {post.date}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs/snug font-medium">Location</h4>
                  <Badge className="text-muted-foreground" variant={"outline"}>
                    <MapPin size={16} />
                    {post.location}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs/snug font-medium">Reference ID</h4>
                  <Badge className="text-muted-foreground" variant={"outline"}>
                    <KeyRound size={16} />
                    {post.id}
                  </Badge>
                </div>
              </CardContent>
            </CardHeader>
            <CardContent>
              <Separator />
            </CardContent>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>
                Ask a question or share useful information about this item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-md border p-3">
                      <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {comment.author_id === user.id ? "You" : `User ${comment.author_id.slice(0, 8)}`} · {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
              <form action={createComment} className="space-y-3 border-t pt-4">
                <input type="hidden" name="postId" value={post.id} />
                <Textarea name="content" placeholder="Write a comment" required />
                <Button type="submit">Post comment</Button>
              </form>
            </CardContent>
          </Card>
          {post.user_id === user.id && (
            <Card className="rounded-sm">
              <Tabs defaultValue="notifications">
                <CardHeader>
                  <TabsList className="w-full">
                    <TabsTrigger value="notifications" className="flex-1 gap-2">
                      <Bell />
                      Notifications
                      {claims.filter((claim) => claim.status === "Pending").length > 0 && (
                        <Badge variant="destructive">
                          {claims.filter((claim) => claim.status === "Pending").length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="manage" className="flex-1">
                      Manage post
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="notifications" className="px-6 pb-6">
                  {claims.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No claim requests have been submitted for this post.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {claims.map((claim) => (
                        <div
                          key={claim.id}
                          className="rounded-md border p-3 text-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium">
                                Claim request from {claim.claimant_id.slice(0, 8)}
                              </p>
                              <p className="mt-1 line-clamp-2 text-muted-foreground">
                                {claim.proof_details}
                              </p>
                              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock3 className="size-3" />
                                {new Date(claim.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                claim.status === "Approved"
                                  ? "default"
                                  : claim.status === "Rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {claim.status}
                            </Badge>
                          </div>
                          <Button
                            className="mt-3 w-full"
                            size="sm"
                            variant={claim.status === "Pending" ? "default" : "outline"}
                            nativeButton={false}
                            render={<Link href={`/claims/${claim.id}`} />}
                          >
                            {claim.status === "Pending" ? <Check /> : <Bell />}
                            {claim.status === "Pending" ? "Review claim" : "View claim"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="manage" className="px-6 pb-6">
                  <div className="grid grid-cols-2 items-start gap-3">
                  <details>
                    <summary
                      aria-disabled={isPending}
                      onClick={(e) => {
                        if (isPending) e.preventDefault();
                      }}
                      className={`flex h-9 w-full list-none items-center justify-center rounded-md px-2.5 text-sm font-medium transition-colors ${
                        isPending
                          ? "cursor-not-allowed bg-primary text-primary-foreground"
                          : "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      Edit post
                    </summary>
                    <form
                      action={formAction}
                      className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"
                    >
                      <input type="hidden" name="postId" value={post.id} />
                      <label className="grid gap-1 text-sm">
                        Item name
                        <Input
                          name="itemName"
                          defaultValue={post.item_name}
                          required
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        Category
                        <Select
                          name="category"
                          defaultValue={post.category}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            side="bottom"
                            collisionAvoidance={{
                              side: "shift",
                              align: "shift",
                              fallbackAxisSide: "none",
                            }}
                          >
                            <SelectGroup>
                              {categories.map(([label, value]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="grid gap-1 text-sm">
                        Date
                        <Input
                          type="date"
                          name="date"
                          defaultValue={post.date}
                          required
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        Location
                        <Input
                          name="location"
                          defaultValue={post.location}
                          required
                        />
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        Description
                        <Textarea
                          name="description"
                          defaultValue={post.description}
                          required
                        />
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        Replace image
                        <Input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png"
                        />
                      </label>
                      <Button
                        type="submit"
                        className="w-fit md:col-span-2 cursor-pointer"
                        disabled={isPending}
                      >
                        {isPending && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {isPending ? "Saving..." : "Save changes"}
                      </Button>
                    </form>
                  </details>
                  <DeleteModal id={post.id} disabled={isPending} />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </main>
        {post.user_id !== user.id && (
          <div className="w-100 p-4 h-fit border border-primary/20 rounded-sm space-y-6">
            <div className="space-y-2">
              <h2 className="font-semibold flex gap-1 items-center">
                <ShieldCheck size={18} />
                Claim this item
              </h2>
              <p className="text-xs text-muted-foreground">
                If this is your item, provide specific details to prove
                ownership.
              </p>
            </div>
            <Link href={`/claims/new/${post.id}`}>
              <Button className="w-full rounded-sm cursor-pointer">
                Submit Claim
              </Button>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}