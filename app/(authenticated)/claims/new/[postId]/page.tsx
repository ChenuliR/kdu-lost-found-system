import { ClaimForm } from "@/components/claims/claim-form";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ClaimPageProps {
  params: Promise<{ postId: string }>;
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { postId } = await params;
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch post details
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select(
      "id, item_name, type, category, location, date, description, image_url, user_id",
    )
    .eq("id", postId)
    .single();

  if (postError || !post) {
    return (
      <PageLayout title="Claim Not Found">
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            The item you're trying to claim doesn't exist.
          </p>
          <Link href="/posts">
            <Button>Back to Items</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Prevent user from claiming their own post
  if (post.user_id === user.id) {
    return (
      <PageLayout title="Cannot Claim Your Own Item">
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            You cannot claim an item that you posted.
          </p>
          <Link href="/posts">
            <Button>Back to Items</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Check if user already claimed this item
  const { data: existingClaim } = await supabase
    .from("claims")
    .select("id")
    .eq("post_id", postId)
    .eq("claimant_id", user.id)
    .single();

  if (existingClaim) {
    return (
      <PageLayout title="Already Claimed">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            You already have a claim on this item.
          </p>
          <Link href="/claims/my-claims">
            <Button className="cursor-pointer">View My Claims</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const claimTypeLabel =
    post.type === "lost" ? "Found Item Claim" : "Lost Item Claim";

  return (
    <PageLayout title={claimTypeLabel}>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href={`/posts/${postId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Item
        </Link>

        {/* <div className="rounded-lg border border-gray-200 bg-primary-background p-4">
          <h3 className="font-semibold text-gray-900">{post.item_name}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {post.category} • {post.location}
          </p>
        </div> */}
        <Card className="rounded-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="font-semibold">{post.item_name}</CardTitle>
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
                  <MapPin size={16} />
                  {post.location}
                </Badge>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        {/* <div className="rounded-lg border border-gray-200 bg-white p-6"> */}
          <ClaimForm postId={postId} itemName={post.item_name} />
        {/* </div> */}
      </div>
    </PageLayout>
  );
}
