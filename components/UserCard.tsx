"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";

type AuthUser = {
  user: User | null;
};

export default function UserComponent({ user }: AuthUser) {
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  return (
    <section className="rounded-[28px] ">
      {currentUser && (
        <div className="w-3xl mx-auto">
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-6">
              <dt>User ID</dt>
              <dd className="font-mono text-xs">{currentUser.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt>Email</dt>
              <dd>{currentUser.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt>Last sign in</dt>
              <dd>
                {currentUser.last_sign_in_at
                  ? new Date(currentUser.last_sign_in_at).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
