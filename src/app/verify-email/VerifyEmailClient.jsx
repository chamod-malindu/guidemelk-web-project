"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { redirectByRole } from "@/lib/redirectByRole";

export default function VerifyEmailClient() {
  const [status, setStatus] = useState("checking"); // checking, verifying, success, error, no-token
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("no-token");
      setMessage("Please check your email and click the verification link to activate your account.");
      return;
    }

    async function verifyAndRedirect() {
      try {
        setStatus("verifying");
        setMessage("Verifying your email address...");

        // Call backend to verify email (receives JSON with role, sets cookie)
        const verifyRes = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
          credentials: "include",
        });

        if (!verifyRes.ok) {
          throw new Error("Verification failed");
        }

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          throw new Error("Verification failed");
        }

        // Fetch the user profile using the newly set cookie
        const profileRes = await fetch("/api/auth/profile", { credentials: "include" });
        if (!profileRes.ok) throw new Error("Unable to fetch profile");
        const { user } = await profileRes.json();

        // Save user in localStorage for client auth checks
        localStorage.setItem("user", JSON.stringify(user));

        setStatus("success");
        setMessage("Email verified successfully!");

        // Redirect by role after short delay
        setTimeout(() => {
          redirectByRole(router, verifyData.role);
        }, 2000);
      } catch (err) {
        console.error("Email verification error:", err);
        setStatus("error");
        setMessage("Email verification failed. Please try again.");
      }
    }
    verifyAndRedirect();
  }, [searchParams, router]);

  const handleManualRedirect = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role) {
        redirectByRole(router, user.role);
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "checking" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "verifying" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
            {status === "error" && <XCircle className="h-5 w-5 text-red-600" />}
            {status === "no-token" && <Mail className="h-5 w-5 text-blue-600" />}

            {status === "checking" && "Checking..."}
            {status === "verifying" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
            {status === "no-token" && "Check Your Email"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {status === "success" && (
            <>
              <p className="text-sm text-gray-500">Redirecting to your dashboard in 2 seconds...</p>
              <Button onClick={handleManualRedirect} className="w-full">
                Go to Dashboard Now
              </Button>
            </>
          )}

          {status === "no-token" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  We’ve sent a verification email to your registered email address. Click the link in the email to verify your account and start using GuideMeLK.
                </p>
              </div>
              <Button asChild className="w-full">
                <a href="/login">Go to Login</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/register">Register New Account</a>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/register">Try Registering Again</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/login">Go to Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
