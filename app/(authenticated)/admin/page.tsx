"use client";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  CircleAlert,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Claim = {
  id: number;
  item: string;
  claimant: string;
  age: string;
  tone: string;
  initials: string;
  status: "Active" | "Claimed" | "Closed";
};

const initialClaims: Claim[] = [
  {
    id: 1,
    item: "Black Leather Wallet",
    claimant: "Sarah Jean Jenkins",
    age: "2 hours ago",
    tone: "bg-amber-100 text-amber-900",
    initials: "BW",
    status: "Active",
  },
  {
    id: 2,
    item: "AirPods Pro (2nd Gen)",
    claimant: "Michael Chang",
    age: "5 hours ago",
    tone: "bg-slate-200 text-slate-700",
    initials: "AP",
    status: "Active",
  },
  {
    id: 3,
    item: "Set of Dorm Keys (Room 402)",
    claimant: "Elena Rodriguez",
    age: "1 day ago",
    tone: "bg-muted text-muted-foreground",
    initials: "K",
    status: "Active",
  },
];

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

export default function AdminDashboardPage() {
  const [claims, setClaims] = useState(initialClaims);
  const [removedPosts, setRemovedPosts] = useState<string[]>([]);

  const dismissClaim = (claimId: number) => {
    setClaims((currentClaims) =>
      currentClaims.filter((claim) => claim.id !== claimId),
    );
  };

  const updateClaimStatus = (claimId: number, status: Claim["status"]) => {
    setClaims((currentClaims) =>
      currentClaims.map((claim) =>
        claim.id === claimId ? { ...claim, status } : claim,
      ),
    );
  };

  return (
    <PageLayout
      title="Admin Dashboard"
      subtitle="Keep the campus lost-and-found moving smoothly."
    >
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Go back"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeft />
            </Button>
            <span className="font-semibold text-foreground">
              Campus L&amp;F
            </span>
            <span className="hidden sm:inline">/ Administration</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/posts/new" />}
            >
              <Plus />
              New Post
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Search">
              <Search />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <Bell />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Admin account">
              <ShieldCheck />
            </Button>
          </div>
        </div>

        <section
          className="grid gap-4 md:grid-cols-3"
          aria-label="Dashboard summary"
        >
          <MetricCard
            label="Active Posts"
            value="1,284"
            icon={<TrendingUp />}
            detail="12% from last month"
          />
          <MetricCard
            label="Pending Claims"
            value="42"
            icon={<Trophy />}
            detail="Needs verification"
            emphasis
          />
          <MetricCard
            label="Resolved Cases"
            value="891"
            icon={<CheckCircle2 />}
            detail="This semester"
          />
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
          <Card>
            <CardHeader className="flex-row items-center justify-between border-b">
              <div>
                <CardTitle>Claims Awaiting Verification</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review ownership evidence before approving a claim.
                </p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Action Required
              </span>
            </CardHeader>
            <CardContent className="gap-0 p-0">
              {claims.length === 0 ? (
                <EmptyState message="All claims have been reviewed." />
              ) : (
                claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex flex-col gap-4 border-b p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-md text-xs font-bold ${claim.tone}`}
                      >
                        {claim.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{claim.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Claimed by {claim.claimant} • {claim.age}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:pl-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          claim.status === "Claimed"
                            ? "bg-emerald-100 text-emerald-800"
                            : claim.status === "Closed"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {claim.status}
                      </span>
                      {claim.status === "Active" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dismissClaim(claim.id)}
                          >
                            <X />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateClaimStatus(claim.id, "Claimed")
                            }
                          >
                            <Check />
                            Approve
                          </Button>
                        </>
                      ) : claim.status === "Claimed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateClaimStatus(claim.id, "Closed")}
                        >
                          Close post
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between border-b">
              <CardTitle>Post Moderation</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="More moderation options"
              >
                <MoreVertical />
              </Button>
            </CardHeader>
            <CardContent className="gap-3 p-4">
              {flaggedPosts
                .filter((post) => !removedPosts.includes(post.item))
                .map((post) => (
                  <div
                    key={post.item}
                    className="rounded-lg border bg-muted/20 p-3"
                  >
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
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.detail}
                    </p>
                  </div>
                ))}
              {removedPosts.length === flaggedPosts.length && (
                <EmptyState message="No flagged posts remain." />
              )}
              <Button
                variant="ghost"
                className="mt-1 w-full justify-center text-sm"
              >
                View All Flagged Posts
                <ArrowRight />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  emphasis = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Card className={emphasis ? "border-amber-200 bg-amber-50/80" : undefined}>
      <CardContent className="flex-row items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="rounded-md bg-background/80 p-2 text-muted-foreground">
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-sm text-muted-foreground">
      <Sparkles className="size-5" />
      <p>{message}</p>
    </div>
  );
}
