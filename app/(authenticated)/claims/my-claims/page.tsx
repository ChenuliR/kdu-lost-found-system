import { ClaimsList } from "@/components/claims/claims-list";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { getAuthUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getUserClaims } from "../actions";

export default async function MyClaimsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getUserClaims();

  if (result.error) {
    return (
      <PageLayout title="My Claims" subtitle="View and manage your claims">
        <div className="text-center text-gray-600">
          Failed to load claims. Please try again later.
        </div>
      </PageLayout>
    );
  }

  const claims = (result.claims || []).map((claim) => ({
    ...claim,
    posts: Array.isArray(claim.posts) ? claim.posts[0] : claim.posts,
  })) as Parameters<typeof ClaimsList>[0]["claims"];

  const pendingCount = claims.filter((c) => c.status === "Pending").length;
  const approvedCount = claims.filter((c) => c.status === "Approved").length;
  const rejectedCount = claims.filter((c) => c.status === "Rejected").length;

  return (
    <PageLayout
      title="My Claims"
      subtitle="View and manage your claims on lost and found items"
      badge={
        <div className="flex items-end gap-2">
          <Badge variant="secondary" className="mb-0">
            {claims.length} Total
          </Badge>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="mb-0">
              {pendingCount} Pending
            </Badge>
          )}
        </div>
      }
      separator={true}
    >
      <ClaimsList claims={claims} />
    </PageLayout>
  );
}
