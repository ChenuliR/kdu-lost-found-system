import {
  getAdminClaimById,
  updateClaimStatus,
} from "@/app/(authenticated)/claims/actions";
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

export default async function AdminClaimReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let claim;

  try {
    claim = await getAdminClaimById(id);
  } catch (error) {
  console.error("Failed to load claim:", error);
  throw error;
}

  if (!claim.post) {
    notFound();
  }

  return (
    <PageLayout
      title="Review Claim"
      subtitle="Compare the claimant's evidence with the original item details before deciding."
    >
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/admin" />}
        >
          <ArrowLeft />
          Back to dashboard
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-4 border-b">
                <div>
                  <CardTitle>{claim.post.itemName}</CardTitle>
                  <CardDescription>
                    Claim submitted {new Date(claim.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge variant={statusVariants[claim.status]}>
                  {claim.status}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                <ReviewField label="Category" value={claim.post.category} />
                <ReviewField label="Item type" value={claim.post.type} />
                <ReviewField label="Date" value={claim.post.date} />
                <ReviewField label="Location" value={claim.post.location} />
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Original description
                  </p>
                  <p className="whitespace-pre-wrap text-sm">
                    {claim.post.description}
                  </p>
                </div>
                {claim.post.imageUrl ? (
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted sm:col-span-2">
                    <Image
                      src={claim.post.imageUrl}
                      alt={claim.post.itemName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claimant evidence</CardTitle>
                <CardDescription>
                  Claimant ID: {claim.claimantId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ReviewText label="Ownership proof" value={claim.proofDetails} />
                <ReviewText label="Contact information" value={claim.contactInfo} />
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Decision</CardTitle>
              <CardDescription>
                Record the reason for your decision for future reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {claim.status === "Pending" ? (
                <div className="space-y-4">
                  <form action={updateClaimStatus} className="space-y-4">
                    <input type="hidden" name="claimId" value={claim.id} />
                    <input type="hidden" name="status" value="Approved" />
                    <Textarea
                      name="adminComments"
                      placeholder="Optional approval notes"
                      aria-label="Approval notes"
                    />
                    <Button type="submit" className="w-full">
                      <Check />
                      Approve claim
                    </Button>
                  </form>
                  <form action={updateClaimStatus} className="space-y-4">
                    <input type="hidden" name="claimId" value={claim.id} />
                    <input type="hidden" name="status" value="Rejected" />
                    <Textarea
                      name="adminComments"
                      placeholder="Explain why this claim is rejected"
                      aria-label="Rejection reason"
                      required
                    />
                    <Button type="submit" variant="destructive" className="w-full">
                      <X />
                      Reject claim
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <p className="font-medium">This claim has already been reviewed.</p>
                  {claim.adminComments ? (
                    <ReviewText label="Admin notes" value={claim.adminComments} />
                  ) : null}
                  {claim.reviewedAt ? (
                    <p className="text-muted-foreground">
                      Reviewed {new Date(claim.reviewedAt).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm capitalize">{value}</p>
    </div>
  );
}

function ReviewText({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">
        {value}
      </p>
    </div>
  );
}
