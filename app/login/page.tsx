"use client";

// components/CardDemo.tsx
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/modules/login/hooks/useLogin"; // Import the custom hook
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "../../components/loading";
import React, { useState } from "react";

export function LoginPage() {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = useLogin(() => router.push("/home"));
  const [showLoading, setShowLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowLoading(true);
    const minLoading = new Promise((res) => setTimeout(res, 2000));
    await Promise.all([handleSubmit(e), minLoading]);
    setShowLoading(false);
  };

  return (
    showLoading ? (
      <Loading />
    ) : (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardAction>
             <Link href="/signup" className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                Do not have an account? Sign Up
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <Button type="submit" className="w-full" disabled={loading || showLoading}>
                  {loading || showLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2"></CardFooter>
        </Card>
      </div>
    )
  );
}

export default LoginPage;
