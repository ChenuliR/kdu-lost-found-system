"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  item_name: string;
  type: "lost" | "found";
  category: string;
  location: string;
  date: string;
  image_url: string;
  user_id: string;
}

interface Claim {
  id: string;
  post_id: string;
  status: "Pending" | "Approved" | "Rejected";
  proof_details: string;
  contact_info: string;
  created_at: string;
  reviewed_at: string | null;
  admin_comments: string | null;
  posts: Post;
}

interface ClaimsListProps {
  claims: Claim[];
}

const statusConfig = {
  Pending: {
    color: "bg-yellow-50",
    textColor: "text-yellow-800",
    badgeVariant: "secondary" as const,
  },
  Approved: {
    color: "bg-green-50",
    textColor: "text-green-800",
    badgeVariant: "default" as const,
  },
  Rejected: {
    color: "bg-red-50",
    textColor: "text-red-800",
    badgeVariant: "destructive" as const,
  },
};

const claimTypeLabel = (postType: "lost" | "found") => {
  return postType === "lost" ? "Found This Item" : "Lost This Item";
};

const formatClaimAge = (date: Date) => {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );
  const units = [
    { name: "year", seconds: 31_536_000 },
    { name: "month", seconds: 2_592_000 },
    { name: "day", seconds: 86_400 },
    { name: "hour", seconds: 3_600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];
  const unit =
    units.find(({ seconds }) => elapsedSeconds >= seconds) ?? units.at(-1)!;
  const value = Math.floor(elapsedSeconds / unit.seconds);

  return `${value} ${unit.name}${value === 1 ? "" : "s"} ago`;
};

export function ClaimsList({ claims }: ClaimsListProps) {
  if (claims.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-gray-400" />
        <p className="text-gray-600">
          No claims yet. Start by claiming an item.
        </p>
        <Link href="/">
          <Button className="mt-4 cursor-pointer" variant="outline">
            Browse Items
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => {
        const config = statusConfig[claim.status];
        const itemPost = claim.posts;

        return (
          <Card
            key={claim.id}
            className={`overflow-hidden transition-shadow hover:shadow-md`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">
                      {itemPost.item_name}
                    </CardTitle>
                    <Badge variant={config.badgeVariant}>{claim.status}</Badge>
                  </div>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    {claimTypeLabel(itemPost.type)}
                    <Badge variant={"outline"}>{itemPost.category}</Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{itemPost.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Item Date</p>
                  <p className="font-medium">{itemPost.date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Your Proof</p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed">
                  {claim.proof_details}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <div className="text-xs text-muted-foreground">
                  Claimed {formatClaimAge(new Date(claim.created_at))}
                </div>
                <Link href={`/claims/${claim.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {claim.admin_comments && (
                <div className="rounded bg-white/50 p-2 text-sm">
                  <p className="text-xs font-semibold text-gray-700">
                    Admin Notes
                  </p>
                  <p className="mt-1 text-gray-700">{claim.admin_comments}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
