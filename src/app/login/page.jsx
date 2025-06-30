"use client";
import { useState, useEffect } from "react";
import RoleSelection from "@/components/RoleSelection";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);
  useEffect(() => {
    if (status === "authenticated" && session?.user?.usertype) {
      router.replace(`/${session.user.usertype}/dashboard`);
    }
  }, [status, session, router]);

  if (status === "authenticated" && session?.user?.usertype) {
    return <p>Redirecting...</p>;
  }

  return (
    <main>
      <h1>Welcome to GuideMelk</h1>
      {!role ? (
        <RoleSelection onSelect={setRole} />
      ) : (
        <GoogleAuthButton userRole={role} />
      )}
    </main>
  );
}
