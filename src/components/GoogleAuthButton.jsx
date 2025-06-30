"use client";
import { signIn } from "next-auth/react";

export default function GoogleAuthButton({ userRole }) {
  return (
    <button
      onClick={() =>
        signIn("google", {
          callbackUrl: `/auth/after-google?role=${userRole}`,
        })
      }
    >
      Sign in with Google
    </button>
  );
}
