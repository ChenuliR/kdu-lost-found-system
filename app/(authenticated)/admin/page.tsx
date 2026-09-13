import { getAdminClaims, updateClaimStatus } from "@/app/(authenticated)/claims/actions";
import AdminModeration from "@/components/admin-moderation";
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

type Claim = {
  id: string;
  item: string;
  claimant: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

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

export default async function AdminDashboardPage() {
  const claims = (await getAdminClaims()) as Claim[];

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
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                        {claim.item.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{claim.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Claimed by {claim.claimant.slice(0, 8)} • {new Date(claim.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:pl-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          claim.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : claim.status === "Rejected"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {claim.status}
                      </span>
                      {claim.status === "Pending" ? (
                        <>
                          <form action={updateClaimStatus}>
                            <input type="hidden" name="claimId" value={claim.id} />
                            <input type="hidden" name="status" value="Rejected" />
                            <Button variant="outline" size="sm">
                              <X />
                              Reject
                            </Button>
                          </form>
                          <form action={updateClaimStatus}>
                            <input type="hidden" name="claimId" value={claim.id} />
                            <input type="hidden" name="status" value="Approved" />
                            <Button size="sm">
                              <Check />
                              Approve
                            </Button>
                          </form>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <AdminModeration />
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
