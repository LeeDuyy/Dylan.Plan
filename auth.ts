import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAILS = new Set(["leduy221200@gmail.com", "tranquynhnhu2601@gmail.com"]);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  session: { maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    signIn({ user }) {
      return !!user.email && ALLOWED_EMAILS.has(user.email);
    }
  }
});
