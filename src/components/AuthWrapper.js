"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * AuthWrapper protects a page and optionally checks for a specific role.
 * It uses the backend /api/auth/profile endpoint to verify the session.
 */
export default function AuthWrapper({ requiredRole, children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        // ✅ Always verify session from the server using the token cookie
        const res = await fetch("/api/auth/profile", { credentials: "include" });

        if (!res.ok) throw new Error("Failed to verify session");

        const data = await res.json();
        if (!data?.user) throw new Error("Invalid user data");

        // ✅ Check role if required
        if (requiredRole && data.user.role !== requiredRole) {
          throw new Error("User role does not match required role");
        }

        // ✅ Update localStorage with fresh profile info
        localStorage.setItem("user", JSON.stringify(data.user));

        if (isMounted) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("AuthWrapper:", error.message);
        localStorage.removeItem("user");
        if (isMounted) {
          setAuthenticated(false);
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [requiredRole, router]);

  // ✅ While verifying session, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // ✅ Redirect is already triggered inside useEffect
  if (!authenticated) return null;

  return <>{children}</>;
}
