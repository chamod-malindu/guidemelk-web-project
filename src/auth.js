import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  // Support both AUTH_SECRET (older) and NEXTAUTH_SECRET (recommended)
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, trigger }) {
      // Extract role from callback URL
      if (trigger === "signIn" && account?.callbackUrl) {
        try {
          const url = new URL(account.callbackUrl);
          token.usertype = url.searchParams.get("role") || "tourist";
        } catch {
          token.usertype = "tourist";
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Just store usertype in session
      if (token?.usertype) {
        session.user.usertype = token.usertype;
      }
      return session;
    },
  },
});
