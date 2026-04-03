import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

const googleEnabled =
  process.env.PAYGATE_AUTH_GOOGLE_ENABLED === "true" &&
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET;

const appleEnabled =
  process.env.PAYGATE_AUTH_APPLE_ENABLED === "true" &&
  !!process.env.APPLE_ID &&
  !!process.env.APPLE_TEAM_ID &&
  !!process.env.APPLE_PRIVATE_KEY &&
  !!process.env.APPLE_KEY_ID;

const providers = [];

if (googleEnabled) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (appleEnabled) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        keyId: process.env.APPLE_KEY_ID,
      },
    })
  );
}

export default NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }
      if (profile?.email) {
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.provider) {
        session.provider = token.provider;
      }
      return session;
    },
  },
});
