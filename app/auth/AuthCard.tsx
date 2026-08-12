"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { toast } from "../../components/ui/toast";

type AuthProps = {
  user: User | null;
};

export default function AuthComponent({ user }: AuthProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (authMode === "signIn") {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.log(error.message);
      } else {
        toast.add({
          type: "success",
          description: "Signed in successfully.",
        });
      }
      console.log({ data });
    } else {
      const { error, data } = await supabase.auth.signUp({ email, password, options: {
        emailRedirectTo: `${window.location.origin}`
      } });
      
            if (error) {
              console.log(error.message);
            } else {
              toast.add({
                type: "info",
                description: "Check your inbox to confirm the new account",
              });
            }
            console.log({ data });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm shadow-xl [--card-spacing:--spacing(8)]">
        <div className="w-full flex justify-center">
          <span className="bg-primary rounded p-2">
            <LockKeyhole color="#fff" />
          </span>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center tracking-tight">
            {authMode === "signIn"
              ? "Login to your account"
              : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            Use your university email to access the portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="auth-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="41-bse-0000@kdu.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  min={6}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button form="auth-form" type="submit" className="w-full">
            {authMode === "signIn" ? "Login" : "Create Account"}
          </Button>
          <div className="flex justify-center items-center">
            <span>
              {authMode === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <Button
              variant="link"
              onClick={() =>
                setAuthMode(authMode === "signIn" ? "signUp" : "signIn")
              }
            >
              {authMode === "signIn" ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
