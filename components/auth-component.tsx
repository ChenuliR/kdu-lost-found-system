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
import { Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./ui/toast";

export default function AuthComponent() {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const router = useRouter();

  const validateSignUp = (email: string, password: string): string | null => {
    if (!email.endsWith("@kdu.ac.lk")) return "Invalid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === "signIn") {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(error.message);
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "success",
          description: "Signed in successfully",
        });
        router.push("/");
      }
      console.log({ data });
    } else {
      const validationError = validateSignUp(email, password);
      if (validationError) {
        toast.add({
          type: "error",
          description: validationError,
        });
        setIsLoading(false);
        setPassword("");
        return;
      }

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        console.log(error.message);
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "success",
          description: "Created account successfully",
        });
        await supabase.auth.signOut();
        setAuthMode("signIn");
      }
      console.log({ data });
    }
    setIsLoading(false);
    setPassword("");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm shadow-xl [--card-spacing:--spacing(8)]">
        <div className="w-full flex justify-center">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={46}
            height={40}
            className="rounded-xs"
          />
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
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            form="auth-form"
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer  "
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : authMode === "signIn" ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </Button>
          <div className="flex justify-center items-center">
            <span>
              {authMode === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <Button
              variant="link"
              className="underline cursor-pointer"
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
