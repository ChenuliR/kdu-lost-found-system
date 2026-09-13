import { getUserClaims } from "./actions";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusVariants = {
  Pending: "secondary",
  Approved: "default",
  Rejected: "outline",
} as const;

export default async function ClaimsPage() {
  const claims = await getUserClaims();

  return (
    <PageLayout
      title="My Claims"
      subtitle="Track the status of items you have claimed."
    >
      {claims.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            You have not submitted any claims yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader className="flex-row items-center justify-between gap-4">
                <CardTitle className="truncate">{claim.itemName}</CardTitle>
                <Badge variant={statusVariants[claim.status]}>
                  {claim.status}
                </Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Submitted {new Date(claim.createdAt).toLocaleDateString()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}