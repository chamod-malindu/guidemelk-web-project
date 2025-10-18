"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function GoogleAuthButton({ userRole = "tourist", disabled }) {
  const handleGoogleSignIn = () => {
    // Pass role in query string ONLY for new sign-ups
    // Backend will fall back to DB role for existing users
    signIn("google", {
      callbackUrl: `/api/auth/google-callback?role=${encodeURIComponent(userRole)}`
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full h-12 bg-white dark:text-black"
      onClick={handleGoogleSignIn}
      disabled={disabled}
      type="button"
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}
