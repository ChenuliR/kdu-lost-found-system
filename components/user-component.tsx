"use client";

import { User } from "@supabase/supabase-js";

type AuthUser = {
  user: User | null;
};

export default function UserComponent({ user }: AuthUser) {
  return (
    <section className="rounded-[28px] ">
      {user && (
        <div className="w-3xl mx-auto">
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-6">
              <dt>User ID</dt>
              <dd className="font-mono text-xs">{user.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt>Last sign in</dt>
              <dd>
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
