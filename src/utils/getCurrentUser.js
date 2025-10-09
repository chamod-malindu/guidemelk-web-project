/**
 * Fetches the currently logged-in user's profile from the server.
 *
 * @returns {Promise<object|null>} The user object if authenticated, otherwise null.
 */
export async function getCurrentUser(requiredRole = null) {
  try {
    const res = await fetch("/api/auth/profile", { credentials: "include" });

    if (!res.ok) {
      console.warn("getCurrentUser: Not authenticated");
      return null;
    }

    const data = await res.json();
    if (!data?.user) {
      console.warn("getCurrentUser: No user data in response");
      return null;
    }

    // Optional role check
    if (requiredRole && data.user.role !== requiredRole) {
      console.warn(
        `getCurrentUser: User role '${data.user.role}' does not match required '${requiredRole}'`
      );
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}