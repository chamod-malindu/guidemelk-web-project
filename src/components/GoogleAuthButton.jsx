"use client";
import { signIn } from "next-auth/react";

export default function GoogleAuthButton({ children = "Sign in with Google", ...props }) {
  return (
    <button onClick={() => signIn("google")} {...props}>
      {children}
    </button>
  );
}
