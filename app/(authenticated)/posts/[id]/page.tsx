import ImageModal from "@/components/image-modal";
import PageLayout from "@/components/page-layout";
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
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { deletePost, updatePost } from "../actions";
import { Calendar, KeyRound, MapPin, Send, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

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

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <PageLayout>
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
          {post.user_id === user.id && (
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Manage post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 items-start gap-3">
                  <details>
                    <summary className="flex h-9 w-full cursor-pointer list-none items-center justify-center rounded-md bg-black px-2.5 text-sm font-medium text-white hover:bg-gray-800">
                      Edit post
                    </summary>
                    <form action={updatePost} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input type="hidden" name="postId" value={post.id} />
                      <label className="grid gap-1 text-sm">
                        Item name
                        <Input name="itemName" defaultValue={post.item_name} required />
                      </label>
                      <label className="grid gap-1 text-sm">
                        Category
                        <Select name="category" defaultValue={post.category} required>
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
                        <Input type="date" name="date" defaultValue={post.date} required />
                      </label>
                      <label className="grid gap-1 text-sm">
                        Location
                        <Input name="location" defaultValue={post.location} required />
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        Description
                        <Textarea name="description" defaultValue={post.description} required />
                      </label>
                      <label className="grid gap-1 text-sm md:col-span-2">
                        Replace image
                        <Input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png"
                        />
                      </label>
                      <Button type="submit" className="w-fit md:col-span-2">
                        Save changes
                      </Button>
                    </form>
                  </details>
                  <form action={deletePost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <Button type="submit" variant="destructive" className="w-full">
                      Delete post
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
        <div className="w-100 p-4 h-fit border border-primary/20 rounded-sm space-y-6">
          <div className="space-y-2">
            <h2 className="font-semibold flex gap-1 items-center">
              <ShieldCheck size={18} />
              Claim this item
            </h2>
            <p className="text-xs text-muted-foreground">
              If this is your item, provide specific details to prove ownership.
            </p>
          </div>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="description">
                  Details proving ownership
                </FieldLabel>
                <Textarea
                  id="description"
                  placeholder="The serial number is C02x-322..., the wallpaper is a picture of..."
                  className="resize-none rounded-sm"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-info">
                  Contact Information
                </FieldLabel>
                <Input
                  id="contact-info"
                  placeholder="Email or Phone Number"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Button className="w-full rounded-sm cursor-pointer">
            <Send data-icon="inline-start" />
            Submit Claim
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
