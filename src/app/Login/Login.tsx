"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
        );
      }

      const response = await signIn.create({
        identifier: email.trim(),
        password: password.trim(),
      });
      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
        router.push("/Blog");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/Blog",
      });
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Failed to sign up with Google");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center
    flex-col justify-center bg-gray-50"
    >
      <Card className="p-7 w-80 sm:w-96">
        {error && <p>{error}</p>}
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={handleGoogleSignIn}
        >
          <Image src="/google.svg" alt="Google logo" width={20} height={20} />
          Continue with Google
        </Button>
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              or continue with email
            </span>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <Input
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePasswordVisibility}
              className=" cursor-pointer absolute right-1 top-0.5 text-gray-500 hover:text-gray-700 transition-colors hover:bg-transparent"
              aria-label={showPassword ? "Hide password" : "Show password"}
              type="button"
            >
              {showPassword ? (
                <EyeClosed size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </Button>
          </div>
          <Link href={"/ForgotPassword"}>
            <p className="text-xs text-right mb-4">Forgot password?</p>
          </Link>
          <Button className="w-full cursor-pointer">Sign in</Button>
        </form>
      </Card>

      <div className="mt-8 text-xs sm:text-sm">
        {"Don't have an account ?"}{" "}
        <Link href={"/Signup"}>
          <span className="text-blue-600">Sign up for free</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;
