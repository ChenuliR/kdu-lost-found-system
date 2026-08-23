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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Calendar, KeyRound, MapPin, Send, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

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
        <Badge>{post.type}</Badge>
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
