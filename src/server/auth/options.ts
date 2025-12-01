// server/auth/options.ts

import type { NextAuthOptions, DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaClientShared } from "../prismaClientShared";
import bcrypt from "bcryptjs";

// Extend NextAuth types to include id in session.user
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClientShared) as any,

  session: {
    strategy: "database", // or "jwt" if you prefer JWT sessions
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prismaClientShared.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!valid) {
          return null;
        }

        // Return the user object (without password) – NextAuth puts this into the session
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
        };
      },
    }),
  ],

  pages: {
    // Optionally override default login page
    // signIn: "/login",
  },

  callbacks: {
    async session({ session, user }) {
      // If using database sessions, `user` is loaded from DB
      if (user) {
        session.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }

      return session;
    },
  },
};
