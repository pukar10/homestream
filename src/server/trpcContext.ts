// src/server/trpcContext.ts
import type { NextRequest } from "next/server";
import { prisma } from "./db";
import { parse } from "cookie";

// Shape of ctx passed to every tRPC procedure
export type Context = {
  prisma: typeof prisma;
  user: { id: string; email: string } | null;
  req: NextRequest;
};

// Create context for each incoming request
export async function createContext(opts: { req: NextRequest }): Promise<Context> {
  const { req } = opts;

  let user: Context["user"] = null;

  // Example: read session cookie (from our earlier auth setup)
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = parse(cookieHeader);
  const sessionToken = cookies["homestream_session"];

  if (sessionToken) {
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (session && session.expiresAt > new Date()) {
      user = {
        id: session.user.id,
        email: session.user.email,
      };
    }
  }

  return {
    prisma,
    user,
    req,
  };
}
