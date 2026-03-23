import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Add build-time fallbacks
const mockAuthOptions = {
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET || 'mock-secret-for-build',
  providers: (authOptions.providers || []).map(p => ({
    ...p,
    clientId: process.env[`${p.id.toUpperCase()}_ID`] || `mock-${p.id}-id`,
    clientSecret: process.env[`${p.id.toUpperCase()}_SECRET`] || `mock-${p.id}-secret`,
  })) || []
};

const handler = NextAuth(mockAuthOptions);

export { handler as GET, handler as POST };
