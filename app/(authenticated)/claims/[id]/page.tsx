import {
  getClaimForReview,
  updateClaimStatusByOwner,
} from "@/app/(authenticated)/claims/actions";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusVariants = {
  Pending: "secondary",
  Approved: "default",
  Rejected: "outline",
} as const;

export default async function ClaimDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let claim;

  try {
    claim = await getClaimForReview(id);
  } catch {
    notFound();
  }

  const { post } = claim;

  return (
    <PageLayout
      title="Claim Details"
      subtitle="Compare the claimant's evidence with the original item before deciding."
    >
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={`/posts/${post.id}`} />}
        >
          <ArrowLeft />
          Back to item
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-4 border-b">
                <div>
                  <CardTitle>{post.item_name}</CardTitle>
                  <CardDescription>
                    Claim submitted {new Date(claim.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge variant={statusVariants[claim.status]}>{claim.status}</Badge>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                <ReviewField label="Category" value={post.category} />
                <ReviewField label="Item type" value={post.type} />
                <ReviewField label="Date" value={post.date} />
                <ReviewField label="Location" value={post.location} />
                <div className="space-y-1 sm:col-span-2">
                  <ReviewField label="Original description" value={post.description} />
                </div>
                {post.image_url ? (
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted sm:col-span-2">
                    <Image src={post.image_url} alt={post.item_name} fill className="object-cover" />
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claimant evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <ReviewField label="Ownership proof" value={claim.proofDetails} />
                <ReviewField label="Contact information" value={claim.contactInfo} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claim status</CardTitle>
                <CardDescription>
                  {claim.status === "Pending"
                    ? "The post creator has not made a decision yet."
                    : claim.status === "Approved"
                      ? "The post creator approved your claim."
                      : "The post creator rejected your claim."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant={statusVariants[claim.status]}>{claim.status}</Badge>
                {claim.reviewedAt ? (
                  <p className="text-sm text-muted-foreground">
                    Reviewed {new Date(claim.reviewedAt).toLocaleString()}
                  </p>
                ) : null}
                {claim.adminComments ? (
                  <ReviewField label="Reviewer notes" value={claim.adminComments} />
                ) : null}
              </CardContent>
            </Card>
          </div>

          {claim.isPostOwner ? (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Decision</CardTitle>
                <CardDescription>
                  Approve this claim if the evidence matches your item.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {claim.status === "Pending" ? (
                  <div className="space-y-4">
                    <form action={updateClaimStatusByOwner} className="space-y-4">
                      <input type="hidden" name="claimId" value={claim.id} />
                      <input type="hidden" name="status" value="Approved" />
                      <Textarea name="adminComments" placeholder="Optional approval notes" />
                      <Button type="submit" className="w-full"><Check />Approve claim</Button>
                    </form>
                    <form action={updateClaimStatusByOwner} className="space-y-4">
                      <input type="hidden" name="claimId" value={claim.id} />
                      <input type="hidden" name="status" value="Rejected" />
                      <Textarea name="adminComments" placeholder="Explain why this claim is rejected" required />
                      <Button type="submit" variant="destructive" className="w-full"><X />Reject claim</Button>
                    </form>
                  </div>
                ) : (
                  <p className="text-sm font-medium">This claim has already been reviewed.</p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="whitespace-pre-wrap text-sm">{value}</p>
    </div>
  );
}