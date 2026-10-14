import {
  getAdminStats,
  getFlaggedPosts,
} from "@/app/(authenticated)/admin/actions";
import { getAdminClaims } from "@/app/(authenticated)/claims/actions";
import AdminModeration from "@/components/admin-moderation";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

type Claim = {
  id: string;
  item: string;
  claimant: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

const PAGE_SIZE = 10;
const STATUS_FILTERS = ["Pending", "Approved", "Rejected", "All"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: statusParam, page: pageParam } = await searchParams;
  const status: StatusFilter = STATUS_FILTERS.includes(
    statusParam as StatusFilter,
  )
    ? (statusParam as StatusFilter)
    : "Pending";
  const page = Math.max(1, Number(pageParam) || 1);

  const [claimsResult, stats, flagged] = await Promise.all([
    getAdminClaims({ status, page, pageSize: PAGE_SIZE }),
    getAdminStats(),
    getFlaggedPosts(),
  ]);
  const claims = claimsResult.claims as Claim[];
  const totalPages = Math.max(1, Math.ceil(claimsResult.total / PAGE_SIZE));

  return (
    <PageLayout
      title="Admin Dashboard"
      subtitle="Keep the campus lost-and-found moving smoothly."
    >
      <div className="space-y-8">
        <section
          className="grid gap-4 md:grid-cols-3"
          aria-label="Dashboard summary"
        >
          <MetricCard
            label="Active Posts"
            value={stats.activePosts.toLocaleString()}
            icon={<TrendingUp />}
            detail="Currently listed"
          />
          <MetricCard
            label="Pending Claims"
            value={String(stats.pendingClaims)}
            icon={<Trophy />}
            detail="Needs verification"
            emphasis
          />
          <MetricCard
            label="Resolved Cases"
            value={stats.resolvedCases.toLocaleString()}
            icon={<CheckCircle2 />}
            detail="Approved claims"
          />
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
          <Card className="flex h-[36rem] flex-col gap-0 pb-0">
            <CardHeader className="shrink-0 border-b">
              <CardTitle>Claims</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Review ownership evidence before approving a claim.
              </p>
            </CardHeader>

            <div className="flex shrink-0 flex-wrap gap-2 border-b p-3">
              {STATUS_FILTERS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={s === status ? "default" : "outline"}
                  nativeButton={false}
                  render={<Link href={`/admin?status=${s}`} />}
                >
                  {s}
                </Button>
              ))}
            </div>

            <CardContent className="min-h-0 flex-1 gap-0 overflow-y-auto p-0">
              {claims.length === 0 ? (
                <EmptyState
                  message={
                    status === "Pending"
                      ? "All claims have been reviewed."
                      : "No claims match this filter."
                  }
                />
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
                          Claimed by {claim.claimant.slice(0, 8)} •{" "}
                          {new Date(claim.createdAt).toLocaleDateString()}
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
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/claims/${claim.id}`} />}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            {totalPages > 1 && (
              <div className="flex shrink-0 items-center justify-between border-t p-3 text-sm text-muted-foreground">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/admin?status=${status}&page=${page - 1}`}
                        />
                      }
                    >
                      Previous
                    </Button>
                  )}
                  {page < totalPages && (
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/admin?status=${status}&page=${page + 1}`}
                        />
                      }
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

          <AdminModeration posts={flagged.slice(0, 5)} total={flagged.length} />
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
