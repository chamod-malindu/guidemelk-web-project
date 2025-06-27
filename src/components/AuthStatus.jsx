"use client";
import { useSession, signOut } from "next-auth/react";
import GoogleAuthButton from "./GoogleAuthButton";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>Please login</p>
      <GoogleAuthButton>Sign in with Google</GoogleAuthButton>
    </div>
  );
}
