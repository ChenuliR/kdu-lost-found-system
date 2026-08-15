"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

type AuthUser = {
  user: User | null;
};

export default function UserComponent({ user }: AuthUser) {
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    router.push("/auth");
  };

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
          <Button
            className="mt-6 inline-flex w-full items-center justify-center px-4 py-2.5 text-sm font-semibold"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      )}
    </section>
  );
}
