"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";

export default function SignUpform() {
  const [form, setForm] = useState({
    showPassword: false,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const setShowPassword = (show: boolean) =>
    setForm((prev) => ({ ...prev, showPassword: show }));

  const setEmail = (email: string) => setForm((prev) => ({ ...prev, email }));

  const setPassword = (password: string) =>
    setForm((prev) => ({ ...prev, password }));

  const setFirstName = (firstName: string) =>
    setForm((prev) => ({ ...prev, firstName })); // Set first name state

  const setLastName = (lastName: string) =>
    setForm((prev) => ({ ...prev, lastName }));

  const { showPassword, email, password, firstName, lastName } = form;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!form.showPassword);
  };

  const { signUp, setActive, isLoaded } = useSignUp();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      // validation...

      await signUp.create({
        emailAddress: email,
        password: password.trim(),
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      console.log("Sign-up successful, verification email sent");
    } catch (err: unknown) {
      console.error("Sign-up error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during sign-up.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/Blog",
      });
    } catch (err: unknown) {
      console.error("Google sign-up error:", err);
      setError("Failed to sign up with Google");
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/Blog");
        console.log("Account created successfully!");
      } else {
        console.error("Verification incomplete:", completeSignUp);
        setError("Verification failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Verification error:", err);

      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as Record<string, unknown>).errors) &&
        typeof (err as Record<string, any>).errors[0]?.message === "string"
      ) {
        const message = (err as { errors: { message: string }[] }).errors[0]
          .message;
        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid verification code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setError("");
      console.log("Verification code resent");
    } catch (err: unknown) {
      console.error("Resend error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend verification code");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-gray-50">
      <Card className="p-7 w-80 sm:w-96">
        {!pendingVerification ? (
          // Sign Up Form
          <>
            <Button
              className="w-full mb-4"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or sign up with email
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="firstName" className="block mb-2">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    type="text"
                    aria-label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="lastName" className="block mb-2">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    type="text"
                    aria-label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="block mb-2">
                  Email address
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  aria-label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="block mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={togglePasswordVisibility}
                    className="absolute right-1 top-0.5 text-gray-500 hover:text-gray-700 transition-colors hover:bg-transparent"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    type="button"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <Eye size={20} aria-hidden="true" />
                    ) : (
                      <EyeClosed size={20} aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <Button
                className="w-full cursor-pointer"
                type="submit"
                disabled={isLoading || !isLoaded}
                aria-label="Create Account"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </>
        ) : (
          // Verification Form
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
              <p className="text-sm text-gray-600">
                {" We've sent a verification code to"} <strong>{email}</strong>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleVerification}>
              <div>
                <Label htmlFor="verificationCode" className="block mb-2">
                  Verification Code
                </Label>
                <div className="items-center flex justify-center text-lg tracking-widest">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 mb-2">
                {" Didn't receive the code?"}
              </p>
              <Button
                variant="ghost"
                onClick={resendVerificationCode}
                className="text-blue-600 hover:text-blue-700 text-xs"
                disabled={isLoading}
              >
                Resend verification code
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setPendingVerification(false)}
                className="text-gray-500 hover:text-gray-700 text-xs"
                disabled={isLoading}
              >
                Back to sign up
              </Button>
            </div>
          </>
        )}
      </Card>

      <div className="mt-8 text-xs sm:text-sm">
        Already have an account?{" "}
        <Link href="/login">
          <span className="text-blue-600 hover:underline">Sign in instead</span>
        </Link>
      </div>
    </div>
  );
}
