"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function GoogleAuthButton({ userRole, disabled }) {
  return (
    <Button
      variant="outline"
      className="w-full h-12 bg-white"
      onClick={() =>
        signIn("google", {
          callbackUrl: `/auth/after-google?role=${userRole}`,
        })
      }
      disabled={disabled}
      type="button"
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}
