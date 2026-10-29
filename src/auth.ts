
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],

  session: {
  strategy: "jwt",
  maxAge: 60 * 60 * 24, // 24 hours
},

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  callbacks: {
    signIn({ account }) {
      const allowedGithubId = process.env.ADMIN_GITHUB_ID;

      return (
        Boolean(allowedGithubId) &&
        account?.provider === "github" &&
        account.providerAccountId === allowedGithubId
      );
    },

    jwt({ token, account }) {
      if (account?.provider === "github") {
        token.githubId = account.providerAccountId;
      }

      return token;
    },

    session({ session, token }) {
    session.githubId =
        typeof token.githubId === "string"
        ? token.githubId
        : undefined;

    return session;
    },
  },
});
