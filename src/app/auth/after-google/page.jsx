"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AfterGoogle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Get the role from URL parameters
      const selectedRole = searchParams.get('role') || 'tourist';
      
      console.log('Selected role:', selectedRole);
      console.log('Redirecting to:', `/${selectedRole}/dashboard`);
      
      // Redirect to the appropriate dashboard
      router.replace(`/${selectedRole}/dashboard`);
    } else if (status === "unauthenticated") {
      console.log('Not authenticated, redirecting to login');
      router.replace('/login');
    }
  }, [status, searchParams, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return <p>Finishing login...</p>;
}