"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const inputClassName =
    "border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-purple-500 focus-visible:ring-offset-0";

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.18),rgba(168,85,247,0.12)_45%,transparent_70%)]" />

      <div className="absolute left-6 top-6 z-10">
        <Button
          variant="ghost"
          className="text-white/70 hover:bg-white/10 hover:text-white"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <Card className="w-full max-w-md border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(5,8,20,0.65)] backdrop-blur-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">
              Welcome back
            </CardTitle>
            <p className="text-sm text-white/60">
              Sign in to continue your interview prep in seconds.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={inputClassName}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/70">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClassName}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {authError ? (
                <p className="text-sm text-red-400">{authError}</p>
              ) : null}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(99,102,241,0.5)]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Continue
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-white/40">
              Use the email and password you registered with.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
