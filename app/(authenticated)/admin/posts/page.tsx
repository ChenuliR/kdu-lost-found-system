import { getAdminPosts } from "@/app/(authenticated)/admin/actions";
import AdminRemovePostButton from "@/components/admin-remove-post-button";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCategoryLabelMap } from "@/lib/categories";
import { Search } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 15;
const STATUSES = ["All", "Active", "Claimed"] as const;
const TYPES = ["All", "lost", "found"] as const;

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const status = STATUSES.find((s) => s === sp.status) ?? "All";
  const type = TYPES.find((t) => t === sp.type) ?? "All";
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ posts, total }, labels] = await Promise.all([
    getAdminPosts({ q, status, type, page, pageSize: PAGE_SIZE }),
    getCategoryLabelMap(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (overrides: Record<string, string | number>) => {
    const params = new URLSearchParams();
    const next = { q, status, type, page: 1, ...overrides };
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "All") params.set(key, String(value));
    }
    return `/admin/posts?${params.toString()}`;
  };

  return (
    <PageLayout
      title="All Posts"
      subtitle="Search, filter and moderate every listing."
    >
      <div className="space-y-4">
        <form action="/admin/posts" className="flex gap-2">
          <Input name="q" defaultValue={q} placeholder="Search by item name" />
          {status !== "All" && (
            <input type="hidden" name="status" value={status} />
          )}
          {type !== "All" && <input type="hidden" name="type" value={type} />}
          <Button type="submit">
            <Search />
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === status ? "default" : "outline"}
              nativeButton={false}
              render={<Link href={href({ status: s, page: 1 })} />}
            >
              {s}
            </Button>
          ))}
          <span className="mx-1 w-px bg-border" />
          {TYPES.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={t === type ? "default" : "outline"}
              nativeButton={false}
              render={<Link href={href({ type: t, page: 1 })} />}
            >
              {t === "All" ? "All types" : t[0].toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="gap-0 p-0">
            {posts.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No posts match these filters.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 border-b p-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/posts/${post.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {post.item_name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {labels[post.category] ?? post.category} •{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {post.type}
                    </Badge>
                    <Badge
                      variant={
                        (post.status ?? "Active") === "Active"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {post.status ?? "Active"}
                    </Badge>
                    <AdminRemovePostButton
                      postId={post.id}
                      itemName={post.item_name}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} posts • Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={href({ page: page - 1 })} />}
              >
                Previous
              </Button>
            )}
            {page < totalPages && (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={href({ page: page + 1 })} />}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}