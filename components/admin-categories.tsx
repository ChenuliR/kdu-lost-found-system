"use client";

import {
  createCategory,
  deleteCategory,
  renameCategory,
  toggleCategory,
} from "@/app/(authenticated)/admin/categories/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useActionState } from "react";

export type AdminCategory = {
  slug: string;
  label: string;
  active: boolean;
  postCount: number;
};

type CreateState = { error?: string; success?: boolean } | null;

export default function AdminCategories({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: CreateState, formData: FormData) => createCategory(formData),
    null,
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add category</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex gap-2">
            <Input name="label" placeholder="e.g. Umbrella" required />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              Add
            </Button>
          </form>
          {state?.error && (
            <p className="mt-2 text-sm text-destructive">{state.error}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent className="gap-3 p-4">
          {categories.map((c) => (
            <div
              key={c.slug}
              className="flex flex-wrap items-center gap-2 rounded-lg border p-3"
            >
              <form action={renameCategory} className="flex flex-1 gap-2">
                <input type="hidden" name="slug" value={c.slug} />
                <Input name="label" defaultValue={c.label} required />
                <Button type="submit" variant="outline" size="sm">
                  Save
                </Button>
              </form>
              <Badge variant="secondary">{c.postCount} posts</Badge>
              <Badge variant={c.active ? "default" : "outline"}>
                {c.active ? "Active" : "Inactive"}
              </Badge>
              <form action={toggleCategory}>
                <input type="hidden" name="slug" value={c.slug} />
                <input type="hidden" name="active" value={String(!c.active)} />
                <Button type="submit" variant="ghost" size="sm">
                  {c.active ? "Deactivate" : "Activate"}
                </Button>
              </form>
              <form
                action={deleteCategory}
                onSubmit={(e) => {
                  if (!confirm(`Delete "${c.label}"?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="slug" value={c.slug} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-xs"
                  disabled={c.postCount > 0}
                  title={
                    c.postCount > 0 ? "In use: deactivate instead" : "Delete"
                  }
                  aria-label={`Delete ${c.label}`}
                >
                  <Trash2 />
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}