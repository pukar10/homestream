// server/context.ts

import { prismaClientShared } from "./prismaClientShared";

export async function createContext() {
  const session = null;
  const user = null;

  return { 
    prismaClientShared,
    session, 
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
