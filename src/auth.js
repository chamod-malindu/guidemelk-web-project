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
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, trigger }) {
      // On sign in, extract the role from the callbackUrl if present
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
      // Save the usertype in the session
      if (token?.usertype) session.user.usertype = token.usertype;
      return session;
    },
  },
});
