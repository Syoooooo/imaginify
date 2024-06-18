import NextAuth, { DefaultSession } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { db } from "./lib/db";

export type ExtendedUser = DefaultSession["user"] & {
  username: string;
  creditBalance: number;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}



export const { auth, handlers, signIn, signOut } = NextAuth(
  {
    callbacks: {
      async signIn({ user, account }) {
        try {
          const existingUser = await getUserById(
            user.id as string
          );
          if (!existingUser) {
            return false;
          }
  
        } catch (error) {
         console.log("SignIn error", error) 
        }
        
        return true;
      },
      async jwt({ token }) {
        if (!token.sub) return token;

        const existingUser = await getUserById(token.sub);
        console.log(existingUser);

        if (!existingUser) return token;

        token.username = existingUser.username;
        token.creditBalance = existingUser.creditBalance

        console.log(token);

        return token;
      },
      async session({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        if (token.username && session.user) {
          session.user.username = token.username as string;
        }

        if (token.creditBalance && session.user) {
          session.user.creditBalance = token.creditBalance as number
        }
        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  }
);
