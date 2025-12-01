// server/context.ts

import { prismaClientShared } from "./prismaClientShared";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/options";
import type { NextRequest } from "next/server";

type CreateContextOptions = {
  req: Request;
};

export async function createContext({ req }: CreateContextOptions) {
  const session = null;
  const user = null;

  return { 
    prismaClientShared,
    session, 
    user,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
